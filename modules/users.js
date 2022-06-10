const mongoose = require('mongoose')
const shema = mongoose.Schema

const users = new shema({
    FirstName: String,
    LastName: String,
    Email: String,
    Password: String,
})

const Users = mongoose.model('users', users)
module.exports = Users