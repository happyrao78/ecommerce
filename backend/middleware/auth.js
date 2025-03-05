import jwt from 'jsonwebtoken'

const authUser = async(req,res,next)=>{
    const {token}= req.headers;
    console.log("Headers",req.headers)

    if(!token){
        return res.json({success:false,message:"User not Authorized or Token not found, Please Login Again."})
    }
    try {
        const token_decode =jwt.verify(token,process.env.JWT_SECRET)
        req.body.userId = token_decode.id;
        req.user = { id: token_decode.id}; // Store userId in req.user
        next()
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }
}


export default authUser