const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { readdirSync } = require('fs')
const cors = require('cors')
require('dotenv').config()
const router = express.Router()
const path = require('path')

//app
const app = express()

//db
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() => console.log('DB CONNECTED'))
  .catch(err => console.log(`DB CONNECTION ERR ${err}`))

//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json({ limit: '2mb' }))
app.use(cors())

// routes middleware
readdirSync('./routes').map((r) =>
  app.use('/api', require('./routes/' + r))
)

// Server static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.get('/', (req, res) => {
  res.send('HELLO HEROKU')
})


//port
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT)
})