const { axios } = require('../../axios');
const { my_data } = require('../../helpers');
const { get_network_id } = require('../helpers');

let status = '';
let api_response = '';

const buy = async (props) => {
  const { body } = props;

  const { mobile_number, amount, customer_id, network } = body;

  const network_id = get_network_id(network);

  const response = await axios({
    provider: 'alrahuz',
    //url: '/purchase_airtime.php',
    url: '/topup/',
    rawBody: {
      amount,
      customer_id,
      mobile_number,
      airtime_type: 'VTU',
      Ported_number: true,
      network: network_id,
      //network,
      phone: mobile_number,
    },
  });

  // status = response.data?.status;

  // api_response = response.data?.server_response;

  status = response.data?.Status;

  api_response = response.data?.api_response;

  return {
    status,
    api_response,
  };
};

const transaction = async (options) => {
  const {
    body,
    db,
    myId,
    new_balance,
    new_amount_spent,
    status,
    service,
    api_response,
    balance,
  } = options;

  const { amount_to_pay, network, mobile_number } = body;

  const response = await db.user.update({
    where: { id: myId },
    data: {
      balance: new_balance,
      amount_spent: new_amount_spent,
      airtime_transactions_count: {
        increment: 1,
      },
      transactions: {
        create: {
          status,
          service,
          new_balance,
          api_response,
          type: 'purchase',
          provider: network,
          amount: amount_to_pay,
          balance_before: balance,
          mobile_number: mobile_number,
        },
      },
    },
    select: {
      ...my_data,
      transactions: {
        take: 1,
        orderBy: {
          created_at: 'desc',
        },
      },
    },
  });

  const { transactions, ...userData } = response;

  return {
    userData,
    transaction: transactions[0],
  };
};

module.exports = {
  buy,
  transaction,
};
