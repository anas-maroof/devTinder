const mongoose = require('mongoose');
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50,
    },
    lastName: {
        type: String,
        maxlength: 50,
    },
    emailId: {
        type: String,
        maxLength: 100,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email address is not in correct format!!");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })) {
                throw new Error(
                    "Password must contain uppercase, lowercase, number, and special character"
                );
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        max: 100,
    },
    gender: {
        type: String,
        lowercase: true,
        validate(value) {
            if (!["male", "female", "others"].includes(value.toLowerCase())) {
                throw new Error("Gender data is not correct!!");
            }
        },
    },
    photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL!!");
            }
        }
    },
    about: {
        type: String,
        default: "Hey I am new to DevTinder!",
        maxLength: 500,
    },
    skills: {
        type: [String],
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
