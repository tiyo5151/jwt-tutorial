const JWT = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  // JWTを持っているか確認
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: '会員登録してください' });
  } else {
    try {
      let user = await JWT.verify(token, 'JWT_SECRET');
      console.log(user);
      req.user = user.email;
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    next();
  }
};
