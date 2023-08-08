module.exports = async (req, res) => {
  const { db, myId, params } = req;

  const { type, cursor } = params;
  try {
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

    if (cursor) {
      data = await db.transaction.findMany({
        ...request,
        skip: 1,
        cursor: {
          id: cursor,
        },
      });
    } else {
      data = await db.transaction.findMany(request);
    }

    const next_cursor = data[19]?.id;

    res.json({ data, next_cursor });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: 'Server error' });
  }
};
