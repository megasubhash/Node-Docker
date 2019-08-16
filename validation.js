const joi = require('@hapi/joi');

///register validation

const registerValidation =(data)=>{

    const schema={
        name: joi.string().min(6).required(),
        email: joi.string().min(6).email().required(),
        password: joi.string().min(3).required()
    }
    return joi.validate(data,schema);
};
const loginValidation =(data)=>{

    const schema={
        
        email: joi.string().min(6).email().required(),
        password: joi.string.min(3).required()
    }
   return joi.validate(data,schema);
};
module.exports.registerValidation=registerValidation;
module.exports.loginValidation=loginValidation;
