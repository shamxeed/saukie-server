const Axios = require('axios').default;
const { APIs } = require('./api');

const axios = async (props) => {
  const { url, rawBody, provider = 'jonet', token, ...rest } = props || {};

  let body = JSON.stringify(rawBody);

  const { baseURL, ...res } = APIs[provider];

  const isMonnify = provider === 'monnify';

  const headers =
    token && !isMonnify
      ? {
          'b-access-token': token,
        }
      : {};

  if (token && isMonnify) {
    res.Authorization = `Bearer ${token}`;
  }

  let config = {
    method: 'post',
    url: `${baseURL}${url}`,
    headers: {
      ...res,
      ...headers,
      'Content-Type': 'application/json',
    },
    data: body,
    ...rest,
  };

  try {
    const response = await Axios(config);

    return response;
  } catch (err) {
    console.log(err.message);

    const isJonet = provider === 'jonet';

    if (isMonnify) {
      if (err.response?.data) {
        return err.response;
      } else {
        return { data: { requestSuccessful: false } };
      }
    } else if (isJonet) {
      throw new Error(
        err.response?.data?.responseMessage || 'Oops! Something went wrong!!'
      );
    } else if (err.response) {
      if (err.response?.data?.message) {
        throw new Error(err.response?.data?.message);
      } else if (err.response?.data?.detail) {
        throw new Error(err.response?.data?.detail);
      } else if (err.response?.data?.error) {
        throw new Error(err?.response?.data?.error[0]);
      }
    } else if (err.request) {
      if (err?.message?.includes('Network')) {
        throw new Error(err.message);
      }
      throw new Error(err.request._response);
    } else {
      throw new Error('Oops! Something went wrong!');
    }
  }
};

module.exports = {
  axios,
};
