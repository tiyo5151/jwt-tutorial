const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const User = require('../db/User');
const bcrypt = require('bcrypt');

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
    res.status(201).json({ message: 'User created successfully' });
  }
);
module.exports = router;
