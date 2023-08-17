const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { my_data } = require('../../utils/helpers');

module.exports = async (req, res) => {
  const { db, body } = req;

  const { email, password } = body;

  try {
    const get_user = db.user.findFirst({
      where: { email },
      select: {
        ...my_data,
        password: true,
      },
    });

    const getBundle = db.bundle.findMany({
      where: {
        is_disabled: false,
      },
    });

    const [user, bundles] = await db.$transaction([get_user, getBundle]);

    if (!user) {
      return res.status(401).send({ msg: 'Invalid login credentials!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send({ msg: 'Invalid login cridentials!' });
    }

    const SECRET_KEY = process.env.SECRET_KEY;

    const token = jwt.sign({ userId: user.id }, SECRET_KEY);

    delete user.password;

    res.json({
      user,
      token,
      bundles,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: err.message });
  }
};
