const socket = require("socket.io");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        },
    });

    io.on("connection", (socket) => {

        socket.on("joinChat", ({ userId, targetUserId }) => {
            const roomId = [userId, targetUserId].sort().join("_");
            socket.join(roomId);
        });

        socket.on("sendMessage", async ({ userId, targetUserId, newMessage }) => {
            try {
                const roomId = [userId, targetUserId].sort().join("_");

                // Check if both user is friend, otherwise no message
                const friend = await ConnectionRequest.findOne({
                    $or:[
                        {fromUserId:userId, toUserId: targetUserId, status:"accepted"},
                        {fromUserId:targetUserId, toUserId: userId, status:"accepted"},
                    ]
                })
                if(!friend){
                    throw new Error("These guys are not friend, so sending message is not allowed");
                }

                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] },
                });

                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [],
                    });
                }

                chat.messages.push({
                    senderId: userId,
                    text: newMessage,
                });

                await chat.save();

                // 🔥 Populate LAST message sender
                const populatedChat = await Chat.findById(chat._id)
                    .populate("messages.senderId", "firstName photoUrl");

                const lastMessage =
                    populatedChat.messages[populatedChat.messages.length - 1];

                io.to(roomId).emit("messageRecieved", lastMessage);

            } catch (err) {
                console.log(err.message);
            }
        });

        socket.on("disconnect", () => { });
    });
};

module.exports = initializeSocket;
