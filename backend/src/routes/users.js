express=require('express');
const db=require('../model/db')
const jwt=require('jsonwebtoken')

const signupHandeler=require('../controller/signup')
const loginHandeler=require('../controller/login')
const {authenticateToken}=require('../middleware/auth');
const updateHistory=require('../controller/variables/updateHistory')
const bookmark=require('../controller/variables/bookmark')

router=express.Router()

router.get("/",(req,res)=>{res.send("hello")})

router.post("/signup",(req,res)=>{
    signupHandeler(req,res);
})

router.post("/login",(req,res)=>{
    loginHandeler(req,res)
})


///these changes
router.get('/history/bookmark',authenticateToken,(req,res)=>{
    console.log(req.query)
    console.log("recieved")
    bookmark(req,res)
})
router.post("/history/update",authenticateToken,(req,res)=>{
    updateHistory(req,res)
})



module.exports=router