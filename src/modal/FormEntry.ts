import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
});

export const FormEntry = mongoose.models.FormEntry || mongoose.model('FormEntry', formSchema);