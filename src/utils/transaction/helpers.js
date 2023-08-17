const calc_user_balance = (user, amount, isFunding) => {
  const { balance, amount_spent, total_funding } = user;

  const _amount = Number(amount);

  const new_balance = isFunding ? balance + _amount : balance - _amount;

  const new_total_funding = total_funding + _amount;

  const new_amount_spent = amount_spent + _amount;

  return {
    balance,
    new_balance,
    new_amount_spent,
    new_total_funding,
  };
};

const check_status = (status) => {
  const response = {
    transactionFailed: false,
  };

  if (
    !status ||
    status?.toLowerCase() === 'failed' ||
    status?.toLowerCase()?.includes('invalid')
  ) {
    return { transactionFailed: true };
  }

  return response;
};

const network_ids = {
  MTN: 1,
  Glo: 2,
  '9Mobile': 3,
  Airtel: 4,
};

const get_network_id = (network) => network_ids[network];

module.exports = {
  calc_user_balance,
  check_status,
  get_network_id,
};
