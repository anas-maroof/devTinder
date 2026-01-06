const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// Get all the pending connection request
userRouter.get("/user/requests", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"]);
        // .populate("fromUserId", "firstName lastName photoUrl age gender about skills")

        res.json({ message: `Your requests fectched successfully`, data: connectionRequest });
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", "firstName lastName photoUrl age gender about skills")
            .populate("toUserId", "firstName lastName photoUrl age gender about skills");

        const data = connections.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({ message: "Your connections fetched successfully", data })
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        // find all connection request ( send + recieved )
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id },
                { fromUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        const hideUser = new Set();
        connectionRequests.forEach((req) => {
            hideUser.add(req.fromUserId.toString());
            hideUser.add(req.toUserId.toString());
        })

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUser) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select("firstName lastName photoUrl age gender about skills");

        res.send(users);
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

module.exports = userRouter;