import { ObjectId } from "@fastify/mongodb";

export type SecretCredential = {
    _id: ObjectId
}

export interface User {
}

export type Mongoize<T> = T & {
    _id: ObjectId;
}