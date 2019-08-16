const jwt=require('jsonwebtoken');


module.exports =async function (token){
    

    try {
         var varified=await jwt.verify(token,process.env.TOKEN_SECRET);
         return {
            "status":true,
            "details":varified
        };
    } catch (error) {
        return {
            "status":false,
            "details":""
        };
    }
    
   
}

