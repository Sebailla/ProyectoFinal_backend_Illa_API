import mongoose, { Schema } from "mongoose"

const userCollection = 'users'

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  password: { type: String },
  role: { type: String, default: 'user', enum: ['user', 'premium', 'admin'] },
  status: { type: Boolean, default: true },
  image: { type: String },
  createDate: { type: Date, default: Date.now },
  github: { type: Boolean, default: false },
  google: { type: Boolean, default: false },
  cart_id: {
    type: Schema.Types.ObjectId,
    ref: 'carts'
  },
  document: {
    name: {type: String},
    reference: {type: String},
  }, 
  last_connection: {type: Date}
})

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  }
})

const UserModel = mongoose.model(userCollection, userSchema)

export default UserModel