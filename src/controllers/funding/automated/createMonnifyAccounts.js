const { axios } = require('../../../utils/axios');

let response;
const contractCode = process.env.MONNIFY_CONTRACT_CODE;

const logMeIn = async () => {
  return await axios({
    provider: 'monnify',
    url: '/api/v1/auth/login',
  });
};

module.exports = async (req, res) => {
  const { body } = req;

  const { email, token, first_name, last_name } = body;

  const name = `${first_name} ${last_name}`;
  try {
    const { data: authRes } = await logMeIn();

    if (!authRes.requestSuccessful) {
      return res.status(500).send({ msg: 'Server error' });
    }

    const { accessToken } = authRes.responseBody;

    const { data } = await axios({
      method: 'get',
      token: accessToken,
      provider: 'monnify',
      url: `/api/v2/bank-transfer/reserved-accounts/${email}`,
    });

    response = data;

    const { requestSuccessful, responseMessage } = data;

    if (responseMessage === 'Cannot find reserved account') {
      const { data } = await axios({
        token,
        provider: 'monnify',
        url: `/api/v2/bank-transfer/reserved-accounts`,
        rawBody: {
          contractCode,
          accountName: name,
          customerName: name,
          currencyCode: 'NGN',
          customerEmail: email,
          accountReference: email,
          getAllAvailableBanks: true,
        },
      });

      response = data;
    } else if (!requestSuccessful) {
      return res.status(500).send({ msg: 'Server error' });
    }

    const { responseBody } = data;

    const { accounts, accountName } = responseBody;

    res.json({ accountName, accounts });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: 'Server error' });
  }
};
