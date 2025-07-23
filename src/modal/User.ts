import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String, // store hashed passwords
});

export const User =
    mongoose.models.User || mongoose.model('User', UserSchema);
