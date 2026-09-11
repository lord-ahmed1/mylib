const jwt=require('jsonwebtoken')

function generateTokens(username){
    const user={username}
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
    const refreshToken= jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
    return {accessToken,refreshToken}
}

module.exports=generateTokens