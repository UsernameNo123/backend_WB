import mongoose from "mongoose";

const amcSchema = new mongoose.Schema(
    {   
        companyName:{
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        password:{
            type: String,
            required: true,
            minlength: 6,
        },
        SEBIregNumber:{
            type: String,
            required: false,
            unique:true
        },
        emailId:{
            type: String,
            required: true,
            unique: true,
            index: true,
            match: [/\S+@\S+\.\S+/, 'is invalid']
        },
        companyAddress:{
            type: String,
            required: true
        },
        website:{
            type: String,
            required: true
        },
        AUM:{
            type: Number,
            required:true
        }
    }
);

const AMC = mongoose.model('AMC', amcSchema);

export default AMC;