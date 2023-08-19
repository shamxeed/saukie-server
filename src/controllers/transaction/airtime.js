const { airtime, helpers, retry } = require('../../utils/transaction/index');

const { authorization } = require('../../utils/auth');

const service = 'Airtime Topup';

module.exports = async (req, res) => {
  const { body } = req;

  const { amount_to_pay } = body;

  try {
    const authRes = await authorization(req);

    const { error, user, msg, statusCode } = authRes;

    if (error) {
      return res.status(statusCode).send({ msg });
    }

    const calcResults = helpers.calc_user_balance(user, amount_to_pay);

    try {
      const serverRes = await airtime.buy(req);

      const { api_response, status } = serverRes;

      const { transactionFailed } = helpers.check_status(status);

      if (transactionFailed) {
        return res.json({ msg: api_response }, { status: 500 });
      }

      const options = {
        status,
        service,
        api_response,
        ...req,
        ...authRes,
        ...serverRes,
        ...calcResults,
      };

      try {
        const response = await airtime.transaction(options);

        res.json({ ...response, api_response });
      } catch (err) {
        console.log(err.message);

        retry(options);

        res.json({ api_response });
      }
    } catch (err) {
      if (!err.message) {
        retry(options);

        return res.json({ api_response });
      } else {
        res.status(500).send({
          msg: err.message,
        });
      }
    }
  } catch (err) {
    console.log(err.message, 'error');
    res.status(500).send({ msg: 'Server error' });
  }
};
