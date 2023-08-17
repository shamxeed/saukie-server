const { my_data } = require('../../utils/helpers');

module.exports = async (req, res) => {
  const { db, myId } = req;

  try {
    const get_me = db.user.findFirst({
      where: { id: myId },
      select: my_data,
    });

    const get_bundle = db.bundle.findMany({
      where: {
        is_disabled: false,
      },
    });

    const get_transactions = db.transaction.findMany({
      where: {
        type: 'purchase',
        user_id: myId,
      },
      take: 20,
      orderBy: {
        created_at: 'desc',
      },
    });

    const [me, bundles, transactions] = await db.$transaction([
      get_me,
      get_bundle,
      get_transactions,
    ]);

    res.json({ me, bundles, transactions });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: 'Server error' });
  }
};
