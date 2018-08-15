const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userID: String,
  theme: { type: String, default: 'default' },
  premiumMember: { type: Boolean, default: false }
});

UserSchema.statics.setTheme = function(id, theme) {
  return this.findById(id)
    .then(user => {
      user.theme = theme;
      return user.save();
    });
}

UserSchema.statics.setUser = function(userID) {
  return this.find({userID: userID})
    .then(user => {
      if (user.length === 0) {
        return (new this({ userID })).save();
      } else {
        return user[0];
      }
    });
}


mongoose.model('user', UserSchema);
