const router = require('express').Router();
const { publicPosts, privatePosts } = require('../db/post');
const User = require('../db/User');
const path = require('path');
const fs = require('fs');
const JWT = require('jsonwebtoken');
const checkAuth = require('../middleware/checkAuth');

router.get('/public', (req, res) => {
  res.json(publicPosts);
});

router.get('/private', checkAuth, (req, res) => {
  res.json(privatePosts);
});

module.exports = router;
