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

const deduct_and_createTxt = async (miliSecs, props) => {
  const {
    plan,
    myId,
    amount,
    prisma,
    status,
    balance,
    network,
    service,
    new_balance,
    new_amount_spent,
    api_response = '',
    mobile_number,
  } = props || {};

  setTimeout(async () => {
    await prisma.user.update({
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
            api_response,
            type: 'purchase',
            provider: network,
            balance_before: balance,
            new_balance: new_balance,
            mobile_number: mobile_number,
          },
        },
      },
    });
  }, miliSecs);
};

const retry = async (props) => {
  try {
    await deduct_and_createTxt(5000, props);
  } catch (err) {
    deduct_and_createTxt(10000, props);
  }
};

module.exports = {
  retry,
  my_data,
  calc_user_balance,
  check_status,
};
