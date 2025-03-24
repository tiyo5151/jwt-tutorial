const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const User = require('../db/User');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const JWT = require('jsonwebtoken');

router.get('/', (req, res) => {
  res.send('Hello from auth.js');
});

// 新規登録
router.post(
  '/register',
  // validation
  body('email').isEmail(),
  body('password').isLength({ min: 13 }),
  async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    console.log(email, password);

    //DBにユーザーが存在するか確認
    const user = User.find((user) => user.email === email);
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // passwordのハッシュ化
    let hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);

    // DBにユーザーを追加
    User.push({ email, password: hashedPassword });

    fs.writeFileSync(
      path.join(__dirname, '../db/User.js'),
      `module.exports = ${JSON.stringify(User, null, 2)}`
    );

    // JWTの発行

    const token = JWT.sign({ email }, 'JWT_SECRET', {
      expiresIn: '24h',
    });

    res.status(201).json({ message: 'User created successfully', token: token });
  }
);

// ログイン

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = User.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // パスワードの照合
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'password is wrong' });
  }

  const token = JWT.sign({ email }, 'JWT_SECRET', {
    expiresIn: '24h',
  });

  res.status(200).json({ message: 'Login successful', token: token });
});

// DBのユーザー情報を取得
router.get('/users', (req, res) => {
  res.json(User);
});

module.exports = router;
