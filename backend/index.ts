import fastify from 'fastify';
import fastifyCors from "@fastify/cors"
import loginflowPlugin from './plugins/loginflow';
import fastifyPlugin from 'fastify-plugin';

import dotenv from 'dotenv';
import fastifyMongodb from '@fastify/mongodb';
dotenv.config()

const app = fastify();

app.register(fastifyCors, {
    origin: true, // Allow all origins,
    exposedHeaders: ["*"],
    allowedHeaders: ["*"],
});

app.register(fastifyMongodb, {
    // force to close the mongodb connection when app stopped
    // the default value is false
    forceClose: true,

    url: process.env.MONGO_URL,
    database: "test",
})

app.register(fastifyPlugin(async function errorHandler(fastify, options) {
    fastify.setErrorHandler(function (error, request, reply) {
        // Log the error
        console.error(error);

        // Send a generic message to the client
        reply.status(500).send({ error: 'Internal Server Error' });
    });
}))

app.register(loginflowPlugin);

const PORT = parseInt(process.env.PORT ?? "3000")

// Start the server
app.listen({ port: PORT, host: "0.0.0.0" }, (error, address) => {
    if (error) {
        console.error(error);
    }

    console.log(`Server listening on ${address}`);
});
