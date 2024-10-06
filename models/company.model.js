import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        unique: true,
    },
    description:{
        type:String,
    },
    website:{
        type:String,
    },
    location:{
        type:String,
    },
    logo:{
        type:String,  //URL of logo
    },
    userId:{  //created by which user?
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,  
    },
},{timestamps:true})

export const Company = mongoose.model('Company', companySchema); 