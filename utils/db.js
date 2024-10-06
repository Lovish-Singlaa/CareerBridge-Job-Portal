import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("mongoDB connected successfully");
    } catch (error) {
        console.log(error);
    }
}

export default dbConnect;