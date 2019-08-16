'use strict';

const Hapi = require('hapi');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
var routes = require('./Routes/index');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
//const jwt = require('hapi-auth-jwt2');
dotenv.config();


///database connection/////////
    mongoose
    .connect(
        process.env.DB_CONNECT_URL,
      { useNewUrlParser: true }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


    const swaggerOptions = {
        info: {
            title: 'Blog API Documentation',
            version: '0.0.1',
        }
    };
    
const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: "0.0.0.0"
    });
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);
    await server.start();
    console.log('Server running on %ss', server.info.uri);

    server.route(routes);
};







init();