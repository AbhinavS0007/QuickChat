import cloudinary from "../lib/cloudinary.js";
import { genrateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcrypt';



export const signup = async (req, res) => {
    try {

        const {fullName, email, password} = req.body ;
        // console.log(fullName, email, password);


        if(!email || !password || !fullName) {
            return res.status(400).json({message: 'All details is required'});
        }
        const existingUser =await User.findOne({ email})
        if(existingUser) return res.status(400).json({message: 'User already exists'});

        if(password.length < 6){
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        } 


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User(
            {
                fullName, 
                email, 
                password: hashedPassword,
            }
        )

        if(newUser){
            // Generate JWT token and set it in the response cookies
            genrateToken(newUser._id,res)
            await newUser.save();
            // return res.status(201).json({message: 'User registered successfully', user: newUser});
            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        }else{
            console.log("error in signup controller : ", error.message);
            res.status(500).json({message: 'Invailid  User'});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body ;

        if(!email ||!password) {
            return res.status(400).json({message: 'All details are required'});
        }

        const user = await User.findOne({ email})
        if(!user) return res.status(400).json({message: 'User not found'});
        

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: 'Invalid credentials'});

        genrateToken(user._id,res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })


    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const logout = (req, res) => {
    try {
        res.cookie('jwt',"",{maxAge:0})
        res.status(200).json({message: 'Logged out successfully'})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userID = req.user._id

        if(!profilePic){
            return res.status(400).json({message: 'Profile picture is required'});
        }
        const uplodeResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userID, {profilePic:uplodeResponse.secure_url}, {new: true});
        res.status(200).json({message: updatedUser})

    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("error in check auth message");
        
        res.status(500).json({message: error.message});
    }
}