const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  online: { type: Boolean, default: false },
},{timestamps:true});

userSchema.pre("save", function () {
    if (!this.isModified("password")) {
        return;
    }
    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt)
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

userSchema.methods.getjwttoken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

const User = mongoose.model("User", userSchema);

module.exports = User;