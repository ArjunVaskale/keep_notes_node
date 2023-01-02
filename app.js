const express = require("express");
const app = express();
const conn = require('./config/database');
const cors = require('cors')

app.use(cors())
app.use(express.json())


const Notes = require('./model/notes');

conn();

app.get('/' , async (req , res)=>{
        Notes.find({} ,{note : 1 , _id : 1} , (err , data )=>{
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
    res.status(200).send('inserted succesfully!!!');
})

app.delete('/delete' , (req , res)=>{
    console.log(req.body.delId);
    Notes.remove({_id : req.body.delId} , (err , data )=>{
        if(err) return err ;
        console.log('data' ,data);
    })
    res.status(200).send('deleted succesfully!!!');
})


app.put('/update' , (req , res)=>{
    console.log(req.body.delId);
    let oldData = {_id : req.body.itemId} ;
    let newData = {$set : {note : req.body.newNote}} ;
    Notes.updateOne(oldData , newData , (err , data ) =>{
        if(err) return err ;
        console.log('data' ,data);
    })
    res.status(200).send('updated succesfully!!!');
});

module.exports = app ;