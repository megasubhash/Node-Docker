const joi = require('@hapi/joi');
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const Boom = require('boom');
const { registerValidation, loginValidation } = require('../validation');



module.exports = [
    {
        method: 'POST',
        path: '/register',
        config: {
            validate: {
                payload: {
                    name: joi.string().min(6).required(),
                    email: joi.string().min(6).email().required(),
                    password: joi.string().min(3).required()
                },
                query:{
                    alert : joi.boolean().default(false)
                }
            }
        },
        handler: async function (request, h) {

            ///check user

            const emailexist = await User.findOne({ email: request.payload.email });
            if (emailexist)
                return Boom.badRequest('Email already exist');


            ////Hash the password//

            const salt = await bcrypt.genSalt(5);
            const hashedpwd = await bcrypt.hash(request.payload.password, salt);
            //create a new user//
            const user = new User({
                name: request.payload.name,
                email: request.payload.email,
                password: hashedpwd
            });

            try {

                const savedUser = await user.save();
                return savedUser;

            } catch (err) {
                return err;
            }


        }
    },


    ////login
    {
        method: 'POST', path: '/login', handler: async function (request, h) {
            const user = await User.findOne({ email: request.payload.email });
            if (!user)
                return Boom.badRequest('Email not found');
            const validpwd=await bcrypt.compare(request.payload.password,user.password);
            if(!validpwd)
                return Boom.badRequest('invalid password');
            else

            {

                ///create jwt token
                const token=jwt.sign({_id:user._id,email:user.email},process.env.TOKEN_SECRET);
                return token;   
            } 

            

        }
    }
];