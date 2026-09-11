userModel=require('../../model/user');
function bookmark(req,res){
    const bookName = req.query.bookName; 
    const username = req.user.username;
    userModel.findOne({username}).then(async (found,err)=>{
        if (found){
            history=found.history
            lastPage=await history.filter(book=>book.bookName==bookName)[0]
            lastPage=lastPage&&lastPage.page || 1
            res.send(lastPage)
        }
        else{res.send(401)}
    })
}

module.exports=bookmark