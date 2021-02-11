import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true
    },
    email: {
        type: 'string',
        required: true
    },
    followers: [{type:ObjectId,ref: "User"}],
    following: [{type:ObjectId,ref: "User"}],
    username: {
        type: 'string',
        required: true
    },
    password: {
        type: "string",
        required: true
    }
})
mongoose.model("User", userSchema)

// export default mongoose.model("User", userSchema)