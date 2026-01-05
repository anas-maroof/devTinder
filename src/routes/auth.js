const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require('../utils/validation');
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
    // Validate the data
    validateSignUpData(req);

    // Encrypt the password
    const { password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    try {
        const user = new User({
            ...req.body,
            password: hashPassword
        });
        await user.save();

        res.send("User added successfully");
    } catch (err) {
        res.status(400).send("SIGNUP FAILED: " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            // Create a JWT Token
            const token = await user.getJWT();

            // Add the token to cookie and send back the reponse to the user
            res.cookie("token", token, {expires : new Date(Date.now() + 24* 3600000)});

            res.send("Login Successful!");
        }
        else {
            throw new Error("Password not correct!");
        }
    }
    catch (err) {
        res.status(400).send("LOGIN FAILED: " + err.message);
    }
})

module.exports = authRouter;