import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

let authInstance = null;
let mongoClient = null;

// Create or return Native MongoDB client
async function getNativeDB() {
    if (!mongoClient) {
        mongoClient = new MongoClient(process.env.MONGODB_URL);
        await mongoClient.connect();
    }

    // Use a separate database for Better Auth → prevents BSON conflict
    return mongoClient.db("better-auth-db");
}

export const getAuth = async () => {
    if (authInstance) return authInstance;

    const db = await getNativeDB();

    authInstance = betterAuth({
        database: mongodbAdapter(db),
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: process.env.BETTER_AUTH_URL,

        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
        },

        plugins: [nextCookies()],
    });

    return authInstance;
};

export const auth = await getAuth();
