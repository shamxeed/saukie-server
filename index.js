require('dotenv');
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();

const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', (req, res, next) => {
  req.db = prisma;

  next();
});

app.get('/', (req, res) => {
  res.json({ msg: 'Hello from Saukie.net!' });
});

app.use('/v1/funding', require('./src/routes/funding/index'));
app.use('/v1/auth', require('./src/routes/auth/index'));
app.use('/v1/transaction', require('./src/routes/transaction/index'));
app.use('/v1/user', require('./src/routes/user/index'));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
