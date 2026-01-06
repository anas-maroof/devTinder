const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: `{VALUE} is incorrect status type.`
            },
            required: true,
        }
    },
    { timestamps: true, }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// connectionRequestSchema.pre("save", function (next) {
//     const connectionRequest = this;
//     // Check that fromUserId is not same as toUserId
//     if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
//         return next(new Error("You can't send request to yourself"));
//     }
//     next();
// })

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);