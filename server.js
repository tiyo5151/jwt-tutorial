const express = require('express');
const app = express();
const PORT = 3000;
const auth = require('./routes/auth');

app.use(express.json());
app.use('/auth', auth);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});
