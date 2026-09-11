const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose').default;
passport=require('passport');

historySchema=mongoose.Schema({
    bookName:String,
    page:Number
});

userSchema=mongoose.Schema(
    {
        history:[historySchema]
    }
)
userSchema.plugin(passportLocalMongoose);
userModel=mongoose.model('user',userSchema);
passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

module.exports=userModel;