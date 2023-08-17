const authorization = async (data) => {
  const { db, body, query, myId, is_data, select = {} } = data;

  const { amount, pin, amountToPay } = body;

  const response = {
    myId,
    error: true,
    statusCode: 400,
    msg: 'Insufficient balance!',
  };

  const getUser = db.user.findUnique({
    where: { id: myId },
    select: {
      balance: true,
      transaction_pin: true,
      amount_spent: true,
      ...select,
    },
  });

  const options = [getUser];

  if (query) {
    options.push(query);
  }

  const [user, queryRes] = await db.$transaction(options);

  const { transaction_pin, balance } = user;

  if (pin !== transaction_pin) {
    return {
      ...response,
      statusCode: 401,
      msg: 'Incorrect transaction pin!',
    };
  }

  if (is_data) {
    if (!queryRes) {
      return {
        ...response,
        msg: 'This bundle is temporarily disabled!',
      };
    } else if (queryRes.amount > balance) return response;
  } else if (amountToPay) {
    if (amountToPay > balance) return response;
  } else if (amount) {
    if (amount > balance) return response;
  }

  return {
    ...response,
    queryRes,
    user,
    myId,
    error: false,
  };
};

module.exports = {
  authorization,
};
