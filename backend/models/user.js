import mongoose from 'mongoose';
import crypto from 'crypto';

const { Schema } = mongoose;

const UserSchema = new Schema({
  fullName: String,
  email: {
    type: String,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]
  },
  userName: {
    type: String,
    unique: true,
    required: 'Username is required',
    trim: true
  },
  hashedPassword: {
    type: String,
    required: 'Password is required',
    validate: [(password) => {
      return password && password.length > 5;
    }, 'Password must be at least 6 characters.']
  },
  salt: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updated: {
    type: Date,
    default: Date.now
  },
  admin: {
    type: Boolean,
    default: false
  },
},
  {
    collection: "users"
  }
);


UserSchema.virtual('password')
  .set(function (password) {
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.')
    }
    else {
      this.salt = Buffer.from(crypto.randomBytes(16).toString('base64'), 'base64');
      this.hashedPassword = this.hashPassword(password);
    }
  });

UserSchema.methods.hashPassword = function (password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');
};

UserSchema.methods.authenticate = function (password) {
  return this.hashedPassword === this.hashPassword(password);
};

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hashedPassword;
    delete ret.salt;
  }
});

export default mongoose.model('User', UserSchema);