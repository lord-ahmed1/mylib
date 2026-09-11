const passport = require('passport');
const userModel=require('../model/user');
const generateTokens=require('./tokensGenerator')

function loginHandeler(req,res,next){
    passport.authenticate('local',(err,user,info)=>{
        if(err){console.log(err);res.send(info.message)}
        else{
            if(!user){res.status(401);res.send(info.message)}
            else {
                        const tokens=generateTokens(req.body.username)
                        res.status(200);
                        res.send(tokens)      
        }}
    })(req,res,next)
}

module.exports=loginHandeler