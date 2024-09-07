import mongoose, {Model} from 'mongoose';

export interface UserFields {
  username: string;
  password: string;
  token: string;
}

export interface UserMethods {
  checkPassword(password: string): Promise<boolean>;

  generateToken(): void;
}

export type UserModel = Model<UserFields, {}, UserMethods>;

export interface Tasks {
  user: string;
  title: string;
  description: string;
  status: string;
}

