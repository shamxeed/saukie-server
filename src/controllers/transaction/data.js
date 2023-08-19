const { data, helpers, retry } = require('../../utils/transaction/index');
const { authorization } = require('../../utils/auth');

module.exports = async (req, res) => {
  const { body, db } = req;

  const { plan_id, isCoupon } = body;

  const service = isCoupon ? 'Data Coupon' : 'Data Bundle';

  try {
    const query = db.bundle.findUnique({
      where: { id: plan_id },
    });

    const authOptions = { ...req, query, is_data: true };

    const authRes = await authorization(authOptions);

    const { error, user, msg, statusCode, queryRes } = authRes;

    if (error) {
      return res.status(statusCode).json({ msg });
    }

    const { amount, plan, provider } = queryRes;

    const calcResults = helpers.calc_user_balance(user, amount);

    try {
      const serverRes = await data.buy({ ...req, provider });

      const { status, api_response } = serverRes;

      const { transactionFailed } = helpers.check_status(status);

      if (transactionFailed) {
        return res.json({ msg: api_response }, { status: 500 });
      }

      const options = {
        plan,
        amount,
        status,
        service,
        api_response,
        ...req,
        ...authRes,
        ...serverRes,
        ...calcResults,
      };

      try {
        const { userData, transaction } = await data.transaction(options);

        res.json({ userData, transaction, api_response });
      } catch (err) {
        console.log(err.message);

        retry(options);

        return res.json({ api_response });
      }
    } catch (err) {
      if (!err.message) {
        retry(options);

        return res.json({ api_response });
      } else {
        return res.status(500).send({
          msg: err.message,
        });
      }
    }
  } catch (err) {
    console.log(err.message, 'error');
    res.status(500).send({ msg: 'Server error' });
  }
};
