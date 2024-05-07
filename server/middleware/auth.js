const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = async (req,res,next) => {
    try {
        const token = req.header("auth-token");
        console.log(token);
        if(!token){
            return res.json({
                success:false,
                message:"Not Authorized Login again",
            })
        }

        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);
        req.body.userId = tokenDecode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"Error"
        })
    }
}

module.exports = authMiddleware;