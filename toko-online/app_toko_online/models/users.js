const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username wajib diisi.'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email wajib diisi.'],
        unique: true,
        lowercase: true, 
        match: [/\S+@\S+\.\S+/, "Format email tidak valid"]
    },
    password: {
        type: String,
        required: [true, 'Password wajib diisi.'],
        minlength: [6, 'Password minimal harus 6 karakter.']
    },
    address: {
        type: String,
        default: ''
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { 
        createdAt: false, 
        updatedAt: 'updatedAt' 
    }
});
module.exports = mongoose.model('User', UserSchema);