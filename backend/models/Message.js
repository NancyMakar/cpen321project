const mongoose = require('mongoose')
const { v4: uuidv4 } = require("uuid")

const messageSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replaceAll("-", ""),
        },
        groupID: String,
        senderID: String,
        senderName: String,
        messageContent: mongoose.Schema.Types.Mixed,
    },
    {
        timestamps: true,
        collection: "messages",
    }
)

// export a model "Message" based on the messageSchema
module.exports = mongoose.model("Message", messageSchema)
