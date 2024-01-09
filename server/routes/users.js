import express from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from "../models/Users.js";

const router = express.Router(); //set up router that exports an object that contains a router 

//req gets all data from API request to endpoint.
router.post("/register", async (req, res ) => {
    const {username, password} = req.body; // When making an API request in frontend, sends in an object containing username and password from the body.
    const user = await UserModel.findOne({username:username}); //Finds the username in Database if it matches the username in the request body. If the two names are the same, can be shortend to one word. 

    if (user) {
        return res.json({ message: "User already exists!"}); // If a username is returned that is retrieved from Database, return with a JSON message that the user already exists. 
    }
    const hashedPassword = await bcrypt.hash(password, 10) //Hashes password, needed so that we can send to DB.
    const newUser = new UserModel({username, password: hashedPassword}); //Adds a username and password to MongoDB using Mongoose. The passed in value of hashedPassword is the hashed version of the password. 
    await newUser.save(); //Saves to DB.
    res.json({message:"User Registered Successfully"}); 
});
router.post("/login", async (req, res) =>{
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username});

    if (!user){
        return res.json({message: "User Doesn't Exist!"}); //If the username is not found in the database, return a JSON message that the user Doesn't Exist.
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); //Compares password with password with username. Compares Hashed password values using Bcrypt. If so, isPasswordValid becomes TRUE. FALSE OTHERWISE.

    if (!isPasswordValid) {
        return res.json({message: "Username or Password Is Incorrect!"})
    }

    const token = jwt.sign({id: user._id} , "secret"); //Makes sure user is authenticated.
    res.json({token, userID: user._id })
});

export {router as userRouter};

//middleware
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if(token){
        jwt.verify(token, "secret", (err) =>{
            if(err) return res.sendStatus(403);
            next();
        });
    } else {
        res.sendStatus(401);
    }
};