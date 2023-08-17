const deduct_and_createTxt = async (miliSecs, props) => {
  const {
    plan,
    myId,
    amount,
    db,
    status,
    balance,
    network,
    service,
    new_balance,
    new_amount_spent,
    api_response,
    mobile_number,
  } = props || {};

  setTimeout(async () => {
    await db.user.update({
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

module.exports = async (props) => {
  try {
    await deduct_and_createTxt(5000, props);
  } catch (err) {
    deduct_and_createTxt(10000, props);
  }
};
