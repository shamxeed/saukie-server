const { calc_user_balance } = require('../../../utils/helpers');

module.exports = async (req, res) => {
  const { db, body } = req;

  const { amount, account_number, session_id } = body;

  if (!amount || !account_number || !session_id) {
    return res.status(400).send({ msg: 'Bad request' });
  }

  const new_amount = amount - 50;

  try {
    const getSession = db.session.findUnique({
      where: { id: session_id },
    });

    const getUser = db.user.findUnique({
      where: { nuban: account_number },
      select: {
        balance: true,
        total_funding: true,
      },
    });

    const [session, user] = await db.$transaction([getSession, getUser]);

    if (session) {
      return res.json({ msg: 'Transaction already recorded!' });
    }

    const result = calc_user_balance(user, new_amount, true);

    const { new_balance, new_total_funding } = result;

    const fundUser = db.user.update({
      where: { nuban: account_number },
      data: {
        balance: new_balance,
        total_funding: new_total_funding,
        transactions: {
          create: {
            new_balance,
            type: 'funding',
            amount: new_amount,
            status: 'successful',
            channel: 'Automated Funding',
            balance_before: user.balance,
          },
        },
      },
    });

    const createSession = db.session.create({
      data: {
        id: session_id,
      },
    });

    await db.$transaction([fundUser, createSession]);

    res.json({ msg: 'Funded successfully!' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: 'server error' });
  }
};
