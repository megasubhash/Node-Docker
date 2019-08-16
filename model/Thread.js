const mongoose=require('mongoose');

const threadSchema= new mongoose.Schema({
    parentThread:{
        type:String,
        default:null,
        min:4
    },
    title : {
        type:String,
        required:true,
        min:5
    },
   
    content : {
        type:String,
        required:true,
        min:4
    },
    type:{
        type:String,
        required:true,
        min:3
    },
    userEmail:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()

    }
});

module.exports=mongoose.model('Thread',threadSchema);