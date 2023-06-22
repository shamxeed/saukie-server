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

module.exports = {
  calc_user_balance,
};
