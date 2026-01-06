const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

// Get all the pending connection request
userRouter.get("/user/requests", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"]);
        // .populate("fromUserId", "firstName lastName photoUrl age gender about skills")

        res.json({ message: `Data fectched successfully`, data: connectionRequest });
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

module.exports = userRouter;