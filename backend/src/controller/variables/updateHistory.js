const userModel=require('../../model/user')

async function updateHistory(req,res){
    const {bookName,page}=req.body;
    username=req.user.username

    // Step 1: Atomically remove any existing entry for this book
        await userModel.updateOne(
            { username },
            { $pull: { history: { bookName } } }
        );

        // Step 2: Atomically push the updated book and page entry to the array
        const updatedUser = await userModel.findOneAndUpdate(
            { username },
            { $push: { history: { bookName, page } } },
        );
        res.send(200)
}

module.exports=updateHistory