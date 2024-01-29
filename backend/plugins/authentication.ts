import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { FastifyPluginCallback, FastifyReply } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { Mongoize, SecretCredential, User } from '../models';
import crypto from "crypto"

const SECRET = "TONIGHT I WON'T BE CRYING ON THE DANCEFLOOR";

interface AuthenticationPayload {
    user: Mongoize<User>,
    ac_token: string
    salt: string,
    issued_time: number
}

class Encryption {
    static ENCRYPTION_KEY = "BADABEEDABADA DA BADABEE"

    static encrypt(data: SecretCredential) {
        // Convert object to string
        const text = JSON.stringify(data);

        // Generate a secure random initialization vector
        const iv = randomBytes(16);

        // Generate a secure key from the password
        const key = crypto.scryptSync(Encryption.ENCRYPTION_KEY, 'salt', 32); // Use a secure salt in production

        // Create a cipher
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        // Encrypt the text
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return encrypted + "->" + iv.toString("hex")
    }

    static decrypt(cipher: string) {
        const [encrypted, iv] = cipher.split("->")
        
        // Extract the IV from the encrypted object
        const ivBuffer = Buffer.from(iv, 'hex');

        // Generate the key from the password
        const key = crypto.scryptSync(Encryption.ENCRYPTION_KEY, 'salt', 32); // Use the same salt used during encryption

        // Create a decipher
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, ivBuffer);

        // Decrypt the text
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        // Parse the decrypted text as JSON
        return JSON.parse(decrypted) as SecretCredential;
    }
}

export class Authentication {
    static issueLogin(user: Mongoize<User>, credential: SecretCredential) {
        if (!user) {
            throw new Error("Cannot issue login: `user` must be truthy.")
        } else if (!credential) {
            throw new Error("Cannot issue login: `credential` must be truthy.")
        }
        
        const payload: AuthenticationPayload = {
            user,
            ac_token: Encryption.encrypt(credential),
            salt: randomBytes(16).toString('hex'),
            issued_time: Date.now()
        }
        const token = jwt.sign(payload, SECRET, { expiresIn: '7d' });

        return token
    }

    static getUserFromToken(token: string): AuthenticationPayload {
        const payload = jwt.verify(token, SECRET) as AuthenticationPayload

        return payload;
    }
}

declare module 'fastify' {
    interface FastifyRequest {
        user: Mongoize<User>;
        credential: SecretCredential;
    }
}

export const authenticationPlugin: FastifyPluginCallback = fastifyPlugin((app, options, done) => {
    app.addHook("preHandler", async (request, reply) => {
        const token = (request.headers["mine_truly"] ?? "") as string
        if (!token) {
            reply.status(401).send({ message: 'Unauthorized' })
            return;
        }

        try {
            const payload = Authentication.getUserFromToken(token);
            request.user = payload.user;
            request.credential = Encryption.decrypt(payload.ac_token);
        } catch (error) {
            console.error(error);
            reply.status(401).send({ message: 'Unauthorized' });
            return;
        }
    });

    done();
});

export const setAuthenticationCookie = (reply: FastifyReply, user: Mongoize<User>, credential: SecretCredential) => {
    reply.header("yours_truly", Authentication.issueLogin(user, credential))
}

export default Authentication;
