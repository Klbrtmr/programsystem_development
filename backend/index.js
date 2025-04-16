const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb://mongo:27017/mean-app';

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB kapcsolódva');
}).catch(err => {
  console.error('MongoDB kapcsolódási hiba:', err);
});

app.get('/', (req, res) => {
  res.send('Backend működik!');
});

app.listen(PORT, () => {
  console.log(`Szerver fut a ${PORT}-es porton`);
});
