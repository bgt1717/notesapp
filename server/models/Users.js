// models/Users.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({ //Schema an object that defines structure of data.
    username:{type: String, required: true, unique:true}, //username field that must be a string, it is required to be a string and must be unique. 
    password: {type: String, required: true},
    savedNotes: [{type: mongoose.Schema.Types.ObjectId, ref: "Note"}],
});

export const UserModel = mongoose.model("users", UserSchema) //Model generated based off schema. Setting Schema to be a collection. "users" is called from the database. 