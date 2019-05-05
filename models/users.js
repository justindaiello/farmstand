const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true }
});

//authenticate input against DB docs
UserSchema.statics.authenticate = (email, password, callback) => {
  //find doc with users email address
  User.findOne( { email: email} )
    //perform the search and provide a callback to process the results
    .exec((error, user) => {
      if (error) {
        return callback(error)
      } else if ( !user ) {
        const err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      //if the user makes it thru then bcrypt will check password
      bcrypt.compare(password, user.password, (error, result) => {
        if (result === true) {
          //if there is no error (null) then the function worked
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

//hash password before saving to DB. Next means the next piece of middleware. In this case mongoose will save the record to mongo. This refers to the object created that contains the user info. HAVE To use simple func declarations here for some reason. Arrow functions will not work
UserSchema.pre('save', function(next) {
  let user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
