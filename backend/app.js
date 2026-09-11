require('dotenv').config();
const express = require('express');
const path = require('path');
const setupApp=require('./src/controller/setup');

const app = express();
setupApp(app)

const BOOKS_DIR = path.join(__dirname, 'books');
app.set('path_to_app',BOOKS_DIR);

const booksRoute=require('./src/routes/books');
const usersRoute=require('./src/routes/users');

app.use('/api/books',booksRoute);
app.use('/api/users',usersRoute);

app.listen(5000,'0.0.0.0', () => console.log('Server running on port 5000'));