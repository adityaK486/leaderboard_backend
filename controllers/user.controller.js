import User from "../models/user.model.js";
import History from "../models/history.model.js";
import mongoose from "mongoose";
import { formatDistanceToNow } from 'date-fns';

export const createUser = async (req,res) => {
    const {name} = req.body;
    try {
        const existingUser = await User.findOne({name});
        if(existingUser){
            return res.status(400).json({error:"name already taken"});
        }

        const newUser = new User({
            name,
        })
        if(newUser){
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                name:newUser.name,
                points:newUser.totalPoints,
            })
        }else{
            res.status(400).json({error:"Invalid user data"});
        }
    } catch (error) {
        console.log("Error in createUser controller:",error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export const allUsers = async (req,res) => {
    try {
        const users = await User.find();

        if(users.length===0){
            return res.status(200).json([]);
        }

        res.status(200).json(users);
    } catch (error) {
        console.log("Error in allUsers controller:",error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export const claimPoints = async (req,res) => {
    const {userId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const points = Math.floor(Math.random()*10)+1;

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message:"User not found"});

        user.totalPoints+=points;
        await user.save();

        const history = new History({
            userId,
            pointsClaimed:points,
        })
        await history.save();

        res.status(200).json({
            message:"Points claimed successfully",
            pointsClaimed:points,
        })
    } catch (error) {
        console.log("Error in claimPoints controller:",error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export const getRank = async (req,res) => {
    try {
        const users = await User.find()
        .sort({ totalPoints: -1 })
        .select('name totalPoints')
        .lean();
  
      const leaderboard = users.map((user, index) => ({
        _id:user._id,
        rank: index + 1,
        name: user.name,
        totalPoints: user.totalPoints,
      }));
  
      res.status(200).json(leaderboard);
    } catch (error) {
        console.log("Error in getRank controller:",error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export const getHistory = async (req,res) => {
    const {userId} = req.params;
    try {
        const history = await History.find({ userId }).sort({ claimedAt: -1 });

        if (!history.length) {
          return res.status(404).json({ message: 'No history found for this user' });
        }

        const formattedHistory = history.map(item => ({
            ...item._doc, 
            claimedAt: formatDistanceToNow(new Date(item.claimedAt), { addSuffix: true })
        }));
    
        res.status(200).json(formattedHistory);
    } catch (error) {
        console.log("Error in getHistory controller:",error.message);
        res.status(500).json({error:"Internal server error"});
    }
}