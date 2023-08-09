const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'Invalid cridentials, access denied' });
  }

  try {
    const secretKey = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secretKey);

    req.myId = decoded.userId;

    next();
  } catch (err) {
    console.log(err.message);
    res.status(401).json({ msg: 'Invalid token' });
  }
};
