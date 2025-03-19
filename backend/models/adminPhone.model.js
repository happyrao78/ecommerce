import mongoose from 'mongoose';

const adminPhoneSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    } 
});

// Pre-save hook to ensure only one phone number exists
adminPhoneSchema.pre('save', async function(next) {
    await mongoose.model('AdminPhone').deleteMany({});
    next();
});

const AdminPhone = mongoose.model('AdminPhone', adminPhoneSchema);

export default AdminPhone;