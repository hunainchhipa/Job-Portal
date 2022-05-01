const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var ObjectId = require( 'mongodb' ).ObjectId;
const User = require("./model/user");
const Job = require("./model/job");
const Application = require("./model/application");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");
const { verifyToken } = require("./middlewares");

mongoose.connect("mongodb://localhost:27017/jobportal", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(express.static(__dirname + '/static'));

app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/', (req, res)=>{
    res.render('login');
});

app.get('/login', (req, res)=>{
    res.render('login');
});

app.get('/register', (req, res)=>{
    res.render('register');
});

app.get('/forgotpass', (req, res)=>{
    res.render('forgotpass');
});

app.get('/candidate', (req, res)=>{
    res.render('candidate');
});

app.get('/recruiter', (req, res)=>{
    res.render('recruiter');
});

app.get('/postjob', (req, res)=>{
    res.render('postjob');
});

app.get('/jobs', async (req, res)=>{
    res.render('jobs');
});


app.get('/job/:id', async (req, res)=>{
    res.render('jobdetails');
});


app.get('/applied-jobs', async (req, res)=>{
  res.render('applied-jobs');
});

// Login API
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean();

  if (!user) {
    return res.json({ status: "error", error: "Invalid email/password" });
  }

  if (await bcrypt.compare(password, user.password)) {
    // the username, password combination is successful

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      JWT_SECRET
    );
    return res.json({
      status: "ok",
      data: {
        user,
        token,
      },
    });
  }

  res.json({ status: "error", error: "Invalid email/password" });
});

// Register API
app.post("/api/register", async (req, res) => {
  const {
    usertype,
    firstname,
    lastname,
    email,
    password: plainTextPassword,
    companyname,
  } = req.body;

  if (!email || typeof email !== "string") {
    return res.json({ status: "error", error: "Invalid email" });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const response = await User.create({
      usertype,
      firstname,
      lastname,
      email,
      password,
      companyname,
    });
  } catch (error) {
    if (error.code === 11000) {
      //duplicate key
      return res.json({ status: "error", error: "Email already in use" });
    }
    throw error;
  }

  res.json({ status: "ok" });
});

app.put("/api/save-profile", verifyToken, (req, res) => {
  const profile = {
    ...req.body,
  };
  return Folder.updateOne(
    { _id: req.tokenData.id },
    { $set: profile },
    (err, data) => {
      if (err) {
        console.log("Update error", req.params.id, err);
        return res.status(500).send({
          message: "Error in updating profile",
        });
      }
      if (data.n === 1) {
        return res.status(200).send({
          message: "User details updated",
        });
      }
      return res.status(404).send({
        message: "No User found",
      });
    }
  );
});

// Get logged in user profile
app.get("/api/user-profile", verifyToken, (req, res) => {
  User.findById(req.tokenData.id, (err, user) => {
    if (err) {
      return res.status(500).send({
        message: "Error in getting user",
      });
    }

    return res.status(200).send({
      data: user,
    });
  });
});

// Get all jobs
app.get("/api/jobs", verifyToken, async (req, res) => {
    Job.find({}, (err, jobs) => {
        if (err) {
          return res.status(500).send({
            message: "Error in getting jobs",
          });
        }
    
        return res.status(200).send({
          data: jobs,
        });
      });
});

// Get jobs posted by logged in recruiter
app.get("/api/recruiter-jobs", verifyToken, async (req, res) => {
  const query = {
    recruiterId: req.tokenData.id
  }

  Job.find(query, (err, jobs) => {
      if (err) {
        return res.status(500).send({
          message: "Error in getting jobs",
        });
      }
  
      return res.status(200).send({
        data: jobs,
      });
    });
});


// Get jobs posted by logged in recruiter
app.get("/api/recruiter-jobs", verifyToken, async (req, res) => {
  const query = {
    recruiterId: req.tokenData.id
  }

  Job.find(query, (err, jobs) => {
      if (err) {
        return res.status(500).send({
          message: "Error in getting jobs",
        });
      }
  
      return res.status(200).send({
        data: jobs,
      });
    });
});


// Get jobs applied by logged in candidate
// WIP
app.get("/api/candidate-jobs", verifyToken, (req, res) => {
  const query = {
    candidateId: req.tokenData.id
  }

  Application.find(query, (err, applications) => {
    applications.forEach((application) => {
        console.log(application)
    })
    return res.status(200).send(applications)
  })



});

// Get job detail by ID
app.get("/api/job/:id", verifyToken, async (req, res) => {
    Job.findById(req.params.id, (err, job) => {
        if (err) {
          return res.status(500).send({
            message: "Error in getting job",
          });
        }
    
        return res.status(200).send(job);
      });
});

// Post job
app.post("/api/postjob", verifyToken, async (req, res) => {
  const jobObject = {
    ...req.body,
    recruiterId: req.tokenData.id
  }

  try {
    const response = await Job.create(jobObject);
    return res.status(200).send({
      message: "Job created successfully",
      data: response,
    });
  } catch (error) {
    throw error;
  }
});

// Candidate apply job
app.post("/api/apply", verifyToken, async (req, res) => {
  const applicationObj = {
    ...req.body,
    candidateId: req.tokenData.id
  }

  try {
    const response = await Application.create(applicationObj);
    return res.status(200).send({
      message: "Job applied successfully",
      data: response,
    });
  } catch (error) {
    throw error;
  }
});

app.listen(3000, () => {
  console.log("Server up at 3000");
});
