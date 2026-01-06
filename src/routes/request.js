const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // Only interested and ignored can be allowed in this API, no accepted and rejected.
        const allowedStatus = ["interested", "ignored"];
        if (!allowedStatus.includes(status)) {
            throw new Error(`${status} is not allowed. Invalid status type.`);
        }

        // Check that fromUserId is not same as toUserId
        if (fromUserId.equals(toUserId)) {
            throw new Error("You can't send request to yourself");
        }

        // To check if toUserId exist in our database or not
        const existToUserId = await User.findById(toUserId);
        if (!existToUserId) {
            throw new Error("User does not exist!!");
        }

        // To check if there is an existing connectionRequest
        const existingConnectRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingConnectRequest) {
            throw new Error("Connection request already exist");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        });
        const data = await connectionRequest.save();
        res.json({
            message: `${req.user.firstName} is ${status} in ${existToUserId.firstName}`,
            data
        });
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            throw new Error(`${status} is not allowed. Invalid status type.`);
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });
        if (!connectionRequest) {
            throw new Error("Connection request not found!");
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({ message: `Connection Request ${status}`, data });
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

module.exports = requestRouter;