const { helpers } = require('../../../utils/transaction/index');

module.exports = async (req, res) => {
  const { db, body } = req;

  const { eventType, eventData } = body;

  if (eventType !== 'SUCCESSFUL_TRANSACTION') {
    return res.status(400).send({ msg: 'Bad request!' });
  }

  const { transactionReference, customer, amountPaid } = eventData;

  const charge = (amountPaid * 1.5) / 100;

  const amountToFund = Number((amountPaid - charge).toFixed());

  let api_response = `You've successfully received ₦${amountToFund.toLocaleString()} via Automated Funding`;

  try {
    const getSession = db.session.findUnique({
      where: { id: transactionReference },
    });

    const getUser = db.user.findUnique({
      where: { email: customer.email },
      select: {
        balance: true,
        total_funding: true,
      },
    });

    const [session, user] = await db.$transaction([getSession, getUser]);

    if (session) {
      return res.json({ msg: 'Transaction already recorded!' });
    }

    const result = helpers.calc_user_balance(user, amountToFund, true);

    const { new_balance, new_total_funding } = result;

    const fundUser = db.user.update({
      where: { email: customer.email },
      data: {
        balance: new_balance,
        total_funding: new_total_funding,
        transactions: {
          create: {
            new_balance,
            api_response,
            type: 'funding',
            status: 'successful',
            amount: Number(amountToFund),
            channel: 'Automated Funding',
            balance_before: user.balance,
          },
        },
      },
    });

    const createSession = db.session.create({
      data: {
        id: transactionReference,
      },
    });

    await db.$transaction([fundUser, createSession]);

    res.json({ msg: 'Funded successfully!' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: err.message });
  }
};
