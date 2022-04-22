const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('./config')
const { verifyToken } = require('./middlewares')

mongoose.connect('mongodb://localhost:27017/jobportal', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

const app = express()
app.use('/', express.static(path.join(__dirname,'static')))
app.use(bodyParser.json())

// Login API 
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean()

  if(!user) {
      return res.json({ status: 'error', error: 'Invalid email/password'})
  }
  
  if (await bcrypt.compare(password, user.password)) {
      // the username, password combination is successful

      const token = jwt.sign({
          id: user._id,
          email: user.email
      },
      JWT_SECRET
    )
      return res.json({ status: 'ok', data: {
          user,
          token
      } })
  }

  res.json({ status: 'error', error: 'Invalid email/password' });
});

// Register API 
app.post('/api/register', async (req, res) => {
    const { usertype,firstname, lastname, email, password: plainTextPassword, companyname } = req.body
    
    if(!email || typeof email !== 'string') {
        return res.json({ status: 'error', error: 'Invalid email' })
    }

    if(!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password' })
    }

    const password = await bcrypt.hash(plainTextPassword, 10)

    try{
        const response = await User.create({
            usertype,
            firstname, 
            lastname, 
            email, 
            password, 
            companyname
        })
        console.log('User created successfully:',response)
    } catch (error) {
        if (error.code === 11000){
            //duplicate key
            return res.json({ status: 'error', error: 'Email already in use' })
        }
        throw error
    }

    res.json({status: 'ok' })
})

app.get('/api/user-profile', verifyToken, (req, res) => {
    User.findById(req.tokenData.id, (err, user) => {
        if(err) {
            return res.status(500).send({
                message: "Error in getting user"
            })
        }

        return res.status(200).send({
            data: user
        })
    })   
})

app.listen(3000, () => {
    console.log('Server up at 3000')
})