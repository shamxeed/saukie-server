const APIs = {
  jonet: {
    Authorization: process.env.JONET_API_KEY,
    baseURL: 'https://jonet.com.ng/api_live/v1',
  },
  alrahuz: {
    baseURL: 'https://alrahuzdata.com.ng/api',
    Authorization: `Token  ${process.env.ALRAHUZDATA}`,
  },
  dancity: {
    baseURL: 'https://dancitysub.com/api',
    Authorization: `Token ${process.env.DANCITY}`,
  },
  kvdata: {
    baseURL: 'https://kvdata.net/api',
    Authorization: `Token ${process.env.KVDATA}`,
  },
  payscribe: {
    baseURL: 'https://sandbox.payscribe.ng/api/v1',
    Authorization: `Bearer ${process.env.PAYSCRIBE}`,
  },
  vpay: {
    baseURL: 'https://services2.vpay.africa',
    publicKey: 'ab28ff42-a9e9-431a-9187-860d428c45f8',
  },
  monnify: {
    baseURL: 'https://api.monnify.com',
    Authorization: `Basic ${process.env.MONNIFY_API_KEY}`,
  },
};

module.exports = {
  APIs,
};
