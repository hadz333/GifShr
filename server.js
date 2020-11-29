if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

const indexRouter = require('./routes/index')
const postsRouter = require('./routes/posts')
const profileRouter = require('./routes/profile')
const commentsRouter = require('./routes/comments')
const reportRouter = require('./routes/report')
const adminRouter = require('./routes/admin')

// database connection
const mongoose = require('mongoose')
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DATABASE_URL, {
useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/posts', postsRouter)
app.use('/profile', profileRouter)
app.use('/comments', commentsRouter)
app.use('/report', reportRouter)
app.use('/admin', adminRouter)

io.on('connection', () => console.log(`Listening on port ${port}`));
server.listen(port)
