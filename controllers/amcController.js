import AMC from "../models/amcModel.js";
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie.js';

const signupAMC = async(req, res) => {
    try {   
        const { companyName,password,emailId,SEBIregNumber,companyAddress,website,AUM } = req.body;

        const existing_amc = await AMC.findOne({ $or:[{emailId}, {companyName}] });
        if(existing_amc) {
            res.status(400).json({ msg:"AMC already exists with the email or username"})
            return;
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newAMC = new AMC({
            emailId, 
            password:hashPassword, 
            companyName,
            SEBIregNumber,
            companyAddress,
            website,
            AUM
        });
        const savedAMC = await newAMC.save();
        if(savedAMC){
            generateTokenAndSetCookie(savedAMC._id, res)
            res.status(201).json({
                _id:savedAMC._id,
                emailId:savedAMC.emailId,
                companyName:savedAMC.companyName, 
                SEBIregNumber:savedAMC.SEBIregNumber,
                companyAddress:savedAMC.companyAddress,
                website:savedAMC.companyAddress,
                AUM:savedAMC.AUM
            });
        }
        else{
            res.status(400).json({msg:"Invalid AMC data"})
        }
    } catch (error) {
        res.status(500).json({ error })
        console.log({msg:`Error signing up AMC : ${error.message}`});
    }
}

const signinAMC = async(req, res) => {

    try {
        const { companyName,password} = req.body;
        const existing_amc = await AMC.findOne({ companyName })
        if(!existing_amc){
            res.status(404).json({msg:"companyName doesn't exist"})
            return
        }
        const isPasswordCorrect = await bcrypt.compare(password, existing_amc.password)

        if(!isPasswordCorrect) {
            res.status(401).json({msg:"Invalid credentials"})
            return
        }

        generateTokenAndSetCookie(existing_amc._id, res)


        res.status(200).json({
            _id:existing_amc._id,
            emailId:existing_amc.emailId,
            companyName:existing_amc.companyName, 
            SEBIregNumber:existing_amc.SEBIregNumber,
            companyAddress:existing_amc.companyAddress,
            website:existing_amc.companyAddress
        });

    } catch (error) {
        res.status(500).json({ error })
        console.error({msg:`Error signing in AMC : ${error.message}`});
    }
}

const signoutAMC = async(req, res) => {
    try {
        res.cookie("token", "", { maxAge:1 })
        res.status(201).json({msg:"AMC signed out successfully!"});
    } catch (error) {
        res.status(500).json({ error })
        console.log({msg:`Error in signing out user:${error.message}`});
    }
}

const viewAMC = async(req,res) =>{
    const { companyName} = req.body;
    const existing_amc = await AMC.findOne({ companyName });
    
    if(!existing_amc){
        return res.status(404).json({msg:"companyName doesn't exist"});
    }
    else{
        // const isPasswordCorrect = await bcrypt.compare(password, existing_amc.password)

        // if(!isPasswordCorrect) {
        //     return res.status(401).json({msg:"Invalid credentials"})
            
        // }
        const showable_content = {
            companyName:existing_amc.companyName,
            companyAddress:existing_amc.companyAddress,
            website:existing_amc.website,
            SEBIregNumber:existing_amc.SEBIregNumber,
            emailId:existing_amc.emailId,
            AUM:existing_amc.AUM
        };
        return res.status(200).json({msg:showable_content});
    }
}

const deleteAMC = async (req,res) =>{
    const {companyName,password} = req.body;
    try{
        const existing_amc = await AMC.findOne({ companyName })
        if(!existing_amc){
            return res.status(404).json({msg:"companyName doesn't exist"});
        }
        else{
            const isPasswordCorrect = await bcrypt.compare(password, existing_amc.password)

            if(!isPasswordCorrect) {
                return res.status(401).json({msg:"Invalid credentials"})
                
            }
            await AMC.deleteOne({ _id: existing_amc._id });
            res.status(200).json({msg:"The company's records has been deleted successfully!"});
        }
    }
    catch(err){
        res.status(500).json({msg:err.message});
    }
}

const filterAMC = async (req,res)=>{
    const {start_AUM=0,end_AUM=0} = req.body;
    try{
        const savedAMC = await AMC.find({AUM:{$gte:start_AUM,$lte:end_AUM}});
        const showable_content = savedAMC.map((company)=>{
            return {
                emailId:company.emailId,
                companyName:company.companyName, 
                SEBIregNumber:company.SEBIregNumber,
                companyAddress:company.companyAddress,
                website:company.companyAddress,
                AUM:company.AUM
            }
        });
        return res.status(200).json(showable_content);
    }
    catch(err){
        res.status(500).json({msg:err.message});
    }
}

export { signupAMC, signinAMC, signoutAMC ,deleteAMC,viewAMC,filterAMC};
