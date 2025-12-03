// src/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        minlength: 6,
        select: false // Don't return password by default
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    avatar: {
        type: String,
        default: 'default-avatar.jpg'
    },
    // OAuth fields
    provider: {
        type: String,
        enum: ['google', 'github', 'credentials'],
        default: 'credentials'
    },
    providerId: {
        type: String,
        sparse: true // Allows multiple null values
    },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
});

// Update last login on successful authentication
UserSchema.methods.updateLastLogin = function () {
    this.lastLogin = new Date();
    return this.save();
};

// Make password required only for credentials provider
UserSchema.pre('save', function (next) {
    if (this.provider === 'credentials' && !this.password) {
        next(new Error('Password is required for credentials provider'));
    } else {
        next();
    }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);