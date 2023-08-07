const get_transaction = (props) => {
  const { type, cursor, myId, db } = props;

  let data = [];

  let request = {
    where: {
      type,
      user_id: myId,
    },
    take: 20,
    orderBy: {
      created_at: 'desc',
    },
  };

  try {
    if (cursor) {
      data = db.transaction.findMany({
        ...request,
        skip: 1,
        cursor: {
          id: cursor,
        },
      });
    } else {
      data = db.transaction.findMany(request);
    }

    const next_cursor = data[19]?.id;

    return { data, next_cursor };
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  get_transaction,
};
