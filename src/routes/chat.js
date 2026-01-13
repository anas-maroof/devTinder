const express = require("express");
const { Chat } = require("../models/chat");
const { userAuth } = require("../middlewares/auth");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
    const userId = req.user._id;
    const { targetUserId } = req.params;

    try {
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
        }).populate("messages.senderId", "firstName photoUrl");

        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
            });
            await chat.save();
        }

        res.json(chat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = chatRouter;