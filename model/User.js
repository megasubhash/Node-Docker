const mongoose=require('mongoose');


const userSchema= new mongoose.Schema({
    name : {
        type:String,
        required:true,
        min:5
    },
    email : {
        type:String,
        required:true,
        min:4
    },
    password:{
        type:String,
        required:true,
        min:3
    }
});

module.exports=mongoose.model('User',userSchema);