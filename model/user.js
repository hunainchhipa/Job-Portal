const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    usertype: { type:String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    companyname: { type: String, required: false }
  },
  { collection: 'users' }
);

const model = mongoose.model('UserSchema', UserSchema);

module.exports = model