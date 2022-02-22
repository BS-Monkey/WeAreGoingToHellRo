const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schemaCleaner = require('../utils/schemaCleaner');
const { commentSchema } = require('./post');

const notifSchema = new mongoose.Schema(
  {
    title: {
      type: String, 
      required: true, 
    }, 
    content: {
      type: String, 
      required: true, 
    }, 
    url_link: {
      type: String, 
      required: true, 
    }, 
  }
)

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: 3,
      maxlength: 20,
      required: true,
      trim: true,
    },
    ip_address: {
      type: String, 
      required: true, 
    }, 
    passwordHash: {
      type: String,
      required: true,
    },
    avatar: {
      exists: {
        type: Boolean,
        default: 'false',
      },
      imageLink: {
        type: String,
        trim: true,
        default: 'null',
      },
      imageId: {
        type: String,
        trim: true,
        default: 'null',
      },
    },
    karmaPoints: {
      postKarma: {
        type: Number,
        default: 0,
      },
      commentKarma: {
        type: Number,
        default: 0,
      },
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    readPosts: [
      {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post', 
      }, 
    ], 
    notifications: [notifSchema], 
    totalComments: {
      type: Number,
      default: 0,
    },
    userRole: {
      type: Number, 
      default: 3, 
    }, 
    is_banned: {
      type: Boolean, 
      default: false, 
      required: true, 
    }, 
    is_logined: {
      type: Boolean, 
      default: false, 
      required: true, 
    }, 
    last_login: {
      type: Date, 
      require: true, 
    }, 
    date_created: {
      type: Date, 
      require: true
    }, 
    last_updated: {
      type: Date, 
      require: true
    }
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);

// replaces _id with id, convert id to string from ObjectID and deletes __v
schemaCleaner(userSchema);

module.exports = mongoose.model('User', userSchema);
