const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const availableRoutes = require('./routes/available.routes');
const urlRoutes = require('./routes/url.routes'); // Add this line

const app = express();
const corsOptions = {
  origin: ['http://localhost:5500', 'https://iamagoodboy04.github.io'], // Allow specific origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/chats', chatRoutes);
app.use('/available', availableRoutes);
app.use('/', urlRoutes);

app.get('/', (req, res) => {
  res.send("Nothing on this path\n");
});

module.exports = app;