const generateTokens=require('./tokensGenerator')
const userModel=require('../model/user')

async function signupHandeler(req,res){
    try{
        const username=req.body.username;
        const password=req.body.password;
        const user = new userModel({username: username});
        await user.setPassword(password);
        await user.save();
        tokens=generateTokens(username);
        res.status(200);
        res.send(tokens)
    }
    catch(err){res.status(409);res.send("account already exist");console.log(err)}
}

module.exports=signupHandeler