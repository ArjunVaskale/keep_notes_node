const express = require("express");
const app = express();
const conn = require('./config/database');
const cors = require('cors')

const jwt = require('jsonwebtoken');

app.use(cors())
app.use(express.json())

var bcrypt = require('bcryptjs');


const Notes = require('./model/notes');
const Users = require('./model/users');
conn();

app.post('/signup' , async (req , res)=>{
    try{
        console.log('signup body' , req.body.email);

    const {username , email , password} = req.body ;
    if(!username){
        return res.send("username is not valid!");
    }
    if(!email){
        return res.send("email is not valid!");
    }
    if(!password){
        return res.send("password is not valid!");
    }

    const oldUser = await Users.findOne({email : email});
    if(oldUser){
        return res.send("email already exists.please try with another email.");
    }

    let newUser = await Users.create({
        username : username ,
        email : email,
        password : bcrypt.hashSync(password, 8)
    })


    const token = jwt.sign({ user_id : newUser._id , email } , process.env.JWT_SECRET_KEY , {expiresIn : "1h"});

    const newUserResponse = {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        token: token
      };
    

      newUserResponse['token'] = token;
    res.send(newUserResponse);
    }catch(err){
        return res.send('error......' , err);
    }
});

app.post('/signin' , async (req , res)=>{
    const {email , password} = req.body;
    const isUserExists = await Users.findOne({email : email});
    if(isUserExists){
        const checkPassword = await bcrypt.hash(password , 8);

        if(bcrypt.compareSync(password , isUserExists.password)){
            const token = jwt.sign({user_id : isUserExists._id , email} , process.env.JWT_SECRET_KEY , {expiresIn : "2h"})
            return res.json({email : email , token : token });
        }else{
            return res.status(400).send({
                message: "Wrong password.",
              })
        }
    }else{
        return res.status(400).send({
            message: "Invalid email address.",
          })
    }
});



app.get('/' , async (req , res)=>{
    try {

        jwt.decode(req.headers.token);
    }catch(err){
        console.log("Catch Error" , err);
        return res.send('Invalid Token.');
    }
    const isExpired = jwt.decode(req.headers.token);
    if(!isExpired){
        return res.send('Invalid Token.');
    }
    if (Date.now() >= isExpired.exp * 1000) {
        return res.send('Expired Token.');
      }else{
        console.log("token not Expired");
      }
        Notes.find({} ,{note : 1 , _id : 1} , (err , data )=>{
            if(err) throw err;
            res.json(data)
        })
});

app.get('/user' , async (req , res)=>{
    try {
        jwt.decode(req.headers.token);
    }catch(err){
        return res.send('Invalid Token.');
    }
    const isExpired = jwt.decode(req.headers.token);
    if(!isExpired){
        return res.send('Invalid Token.');
    }
    if (Date.now() >= isExpired.exp * 1000) {
        return res.send('Expired Token.');
    }
    const data = jwt.decode(req.headers.token);
    Notes.find({email : data.email} ,{note : 1 , _id : 1} , (err , data )=>{
        if(err) throw err;
        res.json(data)
    })
});

app.post('/' , (req , res)=>{
    const data = jwt.decode(req.headers.token);
    Notes.create({
        note : req.body.item , 
        email : data.email 
      } , (err , data)=>{
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