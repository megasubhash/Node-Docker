const varifyjwt = require('../varifyToken');
const jwt = require('jsonwebtoken');
const Boom = require('boom');
const Thread = require('../model/Thread');
var apirequest = require('request');
const dotenv = require('dotenv');
dotenv.config();


module.exports = [
    {
        method: 'POST',
        path: '/addpost',
        options: {
            description: 'POST a new thread',
            notes: 'insert new thread in database',
            tags: ['api'],
            handler: async function (request, reply) {

                const headers = request.headers;
                const token = headers['authorization'];

                try {
                    varified = await varifyjwt(token);
                } catch (error) {
                    console.log(error);
                }
                if (varified.status) {
                    // return "POST ROUTER";

                    const thread = new Thread({
                        parentThread: request.payload.parentThread,
                        title: request.payload.title,
                        content: request.payload.content,
                        type: request.payload.type,
                        userEmail: request.payload.userEmail
                    });
                    // get count from mongo increment and redis and mongo///=>
                    // redis should get only comment and parent id, job should increment the count

                    if (thread.type == "comment") {
                        
                        apirequest({
                            url: process.env.BEE_QUEUE_URL,
                            method: "POST",
                            json: true,   // <--Very important!!!
                            body: {"threadId":thread.parentThread}
                        }, function (error, response, body) {
                            console.log(response);
                            console.log(error);
                            
                        });
                    }
                    try {
                        const savedPost = await thread.save();

                        return savedPost;
                    } catch (error) {
                        console.log(error);
                    }
                }
                else {
                    return Boom.unauthorized('Invalid access token');
                }


            }
        }
    },


    ////single post

    {
        method: 'GET', path: '/post', options: {
            description: 'Get single post and all comment',
            notes: 'Returns a comment and all comment',
            tags: ['api'], handler: async function (request, h) {


                const headers = request.headers;
                const token = headers['authorization'];

                try {
                    varified = await varifyjwt(token);
                } catch (error) {
                    console.log(error);
                }
                if (varified.status) {
                    const allpost = await Thread.find({ type: "post", _id: request.query.threadid });
                    var postId = allpost[0]._id;
                    const allcommnet = await Thread.find({ parentThread: postId });
                    return ({
                        "post": allpost,
                        "comment": allcommnet
                    });

                }
                else {
                    return Boom.unauthorized('Invalid access token');
                }


            }
        }


    },

    ///all post
    {
        method: 'GET', path: '/allpost', options: {
            description: 'get post list',
            notes: 'Returns an array of post',
            tags: ['api'], handler: async function (request, h) {


                const headers = request.headers;
                const token = headers['authorization'];

                try {
                    varified = await varifyjwt(token);
                } catch (error) {
                    console.log(error);
                }
                if (varified.status) {
                    const allpost = await Thread.find({ type: "post" });

                    return ({
                        "post": allpost,

                    });

                }
                else {
                    return Boom.unauthorized('Invalid access token');
                }


            }
        }

    },
    ////all post from a single user

    {
        method: 'GET', path: '/allpostbyuser', options: {
            description: 'Get thread list of a user',
            notes: 'Returns an array of threads by a user',
            tags: ['api'], handler: async function (request, h) {


                const headers = request.headers;
                const token = headers['authorization'];

                try {
                    varified = await varifyjwt(token);
                } catch (error) {
                    console.log(error);
                }
                if (varified.status) {
                    const allpost = await Thread.find({ type: "post", userEmail: request.query.useremail });
                    const allcommnet = await Thread.find({ type: "comment", userEmail: request.query.useremail });
                    return ({
                        "post": allpost,
                        "comment": allcommnet
                    });

                }
                else {
                    return Boom.unauthorized('Invalid access token');
                }


            }

        }
    }
];