import { Document, Schema, Model, model } from 'mongoose';
import * as PromiseBluebird from 'bluebird';
import { jsonTransform } from './../utils/model_helper';
const bcrypt = PromiseBluebird.promisifyAll(require('bcrypt'));

const userSchema = new Schema(
  {
    username: { type: String, index: true },
    mobile: { type: String, unique: true, sparse: true },
    password_hash: String,
    facebook_id: { type: String, unique: true, sparse: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      transform: jsonTransform(['password_hash']),
    },
  });

userSchema.methods.verifyPassword = async function verifyPassword(password) {
  return bcrypt.compareAsync(password, this.password_hash);
};

userSchema.statics.hashPassword = async function hashPassword(password) {
  return bcrypt.hashAsync(password, 14);
};

/**
 * Public interface for user model
 */
export interface IUser {
  username? :string;
  mobile?: string;
  facebook_id?: string;
}

export interface IUserModel extends IUser, Document {
  verifyPassword(): boolean;
  hashPassword(): string;
}

export const User: Model<IUserModel> =  model<IUserModel>('User', userSchema);
export default User;
