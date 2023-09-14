const { data } = require('../../utils/transaction/index');

module.exports = async (req, res) => {
  try {
    const serverRes = await data.buy({ ...req, provider: 'jonet' });

    res.json(serverRes);
  } catch (err) {
    console.log(err.message, 'error');
    res.status(500).send({ msg: 'Server error' });
  }
};
