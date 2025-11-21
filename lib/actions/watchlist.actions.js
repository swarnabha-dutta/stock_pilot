"use server";

import {connectToDatabase} from "@/database/mongoose";
import {Watchlist} from "@/database/models/watchlist.models";

export async function getWatchlistSymbolsByEmail(email){
    if(!email) return [];


    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;

        if(!db){
            throw new Error("MongoDB connection not found .");
        }

        // 🔥 Ensure index exists — runs once, safe
        await db.collection("user").createIndex({email:1});

        // Better Auth stores users in the "user" collection
        const user = await db.collection("user").findOne({email});

        if(!user) return [];

        const userId = user.id || String(user._id || "");
        if(!userId) return [];

        const items = await Watchlist.find({userId},{symbol:1}).lean();

        return items.map((i) => String(i.symbol));

    }catch (e) {
        console.error("getWatchlistSymbolsByEmail error:", e);
        return [];
    }
}