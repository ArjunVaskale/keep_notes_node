const express = require("express");

const app = express();

const conn = require('./config/database');

const Notes = require('./model/notes');

conn();

app.get('/' , async (req , res)=>{
        Notes.find({} ,{note : 1 , _id : 0} , (err , data )=>{
            if(err) throw err;
            res.json(data) 
        })
    });

module.exports = app ;