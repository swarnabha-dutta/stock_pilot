"use server";

import { MongoClient } from "mongodb";

export const getAllUsersForNewsEmail = async () => {
    try {
        const client = new MongoClient(process.env.MONGODB_URL);
        await client.connect();

        // IMPORTANT: Better Auth uses this DB
        const db = client.db("better-auth-db");

        const users = await db
            .collection("user")
            .find(
                { email: { $exists: true, $ne: null } },
                { projection: { _id: 1, id: 1, email: 1, name: 1, country: 1 } }
            )
            .toArray();

        return users.map((user) => ({
            id: user.id || String(user._id),
            email: user.email,
            name: user.name || "User",
        }));
    } catch (e) {
        console.error("Error fetching users for news email:", e);
        return [];
    }
};
