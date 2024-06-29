const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false
    },
    avatarImage: {
        type: String,
        default: ''
    }
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id}, config.get('jwtPrivateKey'))
    return token
}

const Users = mongoose.model("Users", userSchema)

module.exports = Users