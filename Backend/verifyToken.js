const JWT = require('jsonwebtoken')

function verify(req,res,next)
{
    const authHeader = req.headers.token;
    if(authHeader)
    {
        const token = authHeader.split(' ')[1]; //Providing Header like  "Bearer authtoken"
        JWT.verify(token, process.env.SECRET_KEY, (err, info)=>{
            if(err) res.status(403).json("Invalid Token")
            else{ req.user = info;
            next();
            }
        })
    }
    else{
        return res.status(401).json("You are not authenticated");
    }
}
module.exports = verify;