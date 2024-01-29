import { FastifyPluginCallback } from 'fastify';
import { authenticationPlugin, setAuthenticationCookie } from './authentication';

const loginflowPlugin: FastifyPluginCallback = (app, options, done) => {

    // Some endpoint that ends with calling setAuthenticationCookie

    app.register((subapp, suboptions, subdone) => {
        subapp.register(authenticationPlugin)

        subapp.get("/reissue-token", async function (request, reply) {
            // const user = await this.mongo.db!.collection("users").findOne({
            //     _id: new ObjectId(request.user._id),
            // }) as Mongoize<User>

            // const credential = await this.mongo.db!.collection("platform-credentials").findOne({
            //     _id: new ObjectId(request.user._id),
            // }) as PlatformCredential

            // setAuthenticationCookie(reply, user, credential)

            return {
                success: true
            }
        })

        subdone()
    })

    done();
};

export default loginflowPlugin;
