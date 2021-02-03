import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true
    },
    email: {
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