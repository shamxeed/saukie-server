const { axios } = require('../../axios');
const { my_data } = require('../../helpers');
const { get_network_id } = require('../helpers');

let status = '';
let api_response = '';

const buy = async (props) => {
  const { provider, body } = props;

  const { mobile_number, plan_id, customer_id, network } = body;

  const network_id = get_network_id(network);

  if (provider !== 'jonet') {
    const { data } = await axios({
      url: '/data/',
      rawBody: {
        mobile_number,
        plan: plan_id,
        Ported_number: true,
        network: network_id,
        customer_ref: customer_id,
      },
      provider,
    });

    status = data?.Status;

    api_response = data?.api_response;
  } else {
    const { data } = await axios({
      url: '/purchase_data.php',
      rawBody: {
        customer_id,
        code: plan_id,
        phone: mobile_number,
      },
    });

    status = data?.status;

    api_response = data?.server_response;
  }

  return {
    status,
    api_response,
  };
};

const transaction = async (options) => {
  const {
    myId,
    new_balance,
    new_amount_spent,
    plan,
    amount,
    status,
    service,
    api_response,
    network,
    balance,
    mobile_number,
  } = options;

  const userData = await db.user.update({
    where: { id: myId },
    data: {
      balance: new_balance,
      amount_spent: new_amount_spent,
      data_transactions_count: {
        increment: 1,
      },
      transactions: {
        create: {
          plan,
          amount,
          status,
          service,
          new_balance,
          api_response,
          type: 'purchase',
          provider: network,
          balance_before: balance,
          mobile_number: mobile_number,
        },
      },
    },
    select: my_data,
  });

  return {
    userData,
  };
};

module.exports = {
  buy,
  transaction,
};
