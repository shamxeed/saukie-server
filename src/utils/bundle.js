const get_bundle = (db, id) => {
  console.log(db);
  let qeury = {
    where: {
      is_disabled: false,
    },
  };

  if (!id) {
    return db.bundle.findMany(qeury);
  } else {
    return db.bundle.findUnique({
      where: { id },
    });
  }
};

module.exports = {
  get_bundle,
};
