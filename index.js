const express = require('express');
const app = express();
const User = require('./server/routes/Users');
const Book = require('./server/routes/Books')
const mongoose = require('mongoose');
const config = require('./config');
const cors = require('cors');
const cookieparser = require('cookie-parser');

mongoose.connect(config.MONGODB_URL)
.then(() => console.log('MONGODB is conneted'))
.catch(e => console.log('Failed to connect :', e))

app.use(express.json());
app.use(cors({
  origin : 'http://127.0.0.1:5501',
  credentials : true,
}))
app.use(cookieparser());

app.use('/api/users', User);
app.use('/api/books', Book);



app.listen(3301, () => { console.log('Listen ...') });