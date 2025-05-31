import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req , res) => {
    try {
        const loggedInUserID = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserID}}).select("-password")
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("error in getUsersForSidebar" , error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const getMessages = async (req , res) => {
    try {
        const { id : userToChatID } = req.params;
        const myID  = req.user._id;
        const messages = await Message.find({
            $or: [
                { sender: myID, receiver: userToChatID },
                { sender: userToChatID, receiver: myID }
            ]
        });
        res.status(200).json(messages);
    } catch (error) {
        console.error("error in getMessages" , error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const sendMessages = async (req , res) => {
    try {
        const {text , image} = req.body;
        const {id : receiverID} = req.params;
        const senderID = req.user._id;

        let imageUrl;

        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderID,
            receiverID,
            text,
            image: imageUrl,
        })

        await newMessage.save();

        // todo : realtime functionaity goes here

        res.status(201).json(newMessage);

    } catch (error) {
        console.error("error in sendMessages" , error.message);
        res.status(500).json({error: "Internal server error"});
    }
}