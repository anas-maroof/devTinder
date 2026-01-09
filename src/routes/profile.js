const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    }
    catch (err) {
        res.status(400).send("LOGIN FAILED: " + err.message);
    }
})

profileRouter.put("/profile/edit", userAuth, async (req, res) => {
    try {
        validateEditProfileData(req);
        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your profile edit successfully!`,
            data: loggedInUser
        });
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = req.user;

        if (!validator.isStrongPassword(newPassword, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            throw new Error(
                "Password must contain uppercase, lowercase, number, special character and minimum of 8 character"
            );
        }

        const isPasswordValid = await user.validatePassword(oldPassword);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials!!");
        }

        // Hash & update password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.send("Password updated successfully");

    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

module.exports = profileRouter;