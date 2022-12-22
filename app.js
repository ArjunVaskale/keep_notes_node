const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const conn = require('./config/database');
const cors = require('cors')

app.use(cors())

// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())


const Notes = require('./model/notes');

conn();

app.get('/' , async (req , res)=>{
        Notes.find({} ,{note : 1 , _id : 0} , (err , data )=>{
            if(err) throw err;
            res.json(data)
        })
    });

app.post('/' , (req , res)=>{
    console.log(req.body);
    Notes.create({note : req.body.item} , (err , data)=>{
        if(err) return err ;
        console.log(data);
        })
    res.send('inserted!')
})

module.exports = app ;