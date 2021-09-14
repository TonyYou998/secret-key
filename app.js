require('dotenv').config;
const express=require("express");
const app=express();
const bodyParser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');
const encrypt =require('mongoose-encryption');
require('dotenv').config();//sử dụng env
// console.log(process.env.SECRET);

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology: true });
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));
app.get("/",(req,res)=>{
    res.render("home");

})
app.get("/register",(req,res)=>{
    res.render("register");

})
app.get("/login",(req,res)=>{
    res.render("login");

})

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});
const User=new mongoose.model("User",userSchema);

app.post("/register",(req,res)=>{
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save((err)=>{
        if(!err)
        res.render("secrets");
        else
            console.log(err);
    });
});
app.post("/login",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username},(err,foundUser)=>{
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                
                if(foundUser.password===password){
                    res.render("secrets");
                }
                else
                res.send({err:"username or password is incorrect"})
            }
        }

    })
});  
app.listen(3000,()=>{
    console.log("running on port 3000");
})