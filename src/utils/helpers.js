const my_data = {
  id: true,
  email: true,
  phone: true,
  balance: true,
  bonus: true,
  last_name: true,
  first_name: true,
  transaction_pin: true,
  is_email_verified: true,
  data_transactions_count: true,
  airtime_transactions_count: true,
  amount_spent: true,
  total_funding: true,
  created_at: true,
  role: true,
};

const is_object_empty = function (object) {
  return Object.keys(object).length === 0;
};

module.exports = {
  my_data,
  is_object_empty,
};
