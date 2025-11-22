"use server";

import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.models";
import { revalidatePath } from "next/cache";
import { auth } from "../better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getStocksDetails } from "@/lib/actions/finnhub.actions";

/**
 * Fetch all watchlist symbols for a user via email
 */
export async function getWatchlistSymbolsByEmail(email) {
    if (!email) return [];

    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;

        if (!db) {
            throw new Error("MongoDB connection not found.");
        }

        // 🔥 Ensure index exists — safe, runs once
        await db.collection("user").createIndex({ email: 1 });

        // Find user from BetterAuth "user" collection
        const user = await db.collection("user").findOne({ email });

        if (!user) return [];

        const userId = user.id || String(user._id || "");
        if (!userId) return [];

        // Pull watchlist items
        const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();

        return items.map((i) => String(i.symbol));
    } catch (err) {
        console.error("getWatchlistSymbolsByEmail error:", err);
        return [];
    }
}

/**
 * Add a stock to user's watchlist
 */
export const addToWatchlist = async (symbol, company) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) redirect("/sign-in");

        const userId = session.user.id;

        // Check if already exists
        const exists = await Watchlist.findOne({
            userId,
            symbol: symbol.toUpperCase(),
        });

        if (exists) {
            return { success: false, error: "Stock already in watchlist" };
        }

        // Create new entry
        const newItem = new Watchlist({
            userId,
            symbol: symbol.toUpperCase(),
            company: company.trim(),
        });

        await newItem.save();
        revalidatePath("/watchlist");

        return { success: true, message: "Stock added to watchlist" };
    } catch (error) {
        console.error("Error adding to watchlist:", error);
        throw new Error("Failed to add stock to watchlist");
    }
};

/**
 * Remove a stock from user's watchlist
 */
export const removeFromWatchlist = async (symbol) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) redirect("/sign-in");

        const userId = session.user.id;

        await Watchlist.deleteOne({
            userId,
            symbol: symbol.toUpperCase(),
        });

        revalidatePath("/watchlist");

        return { success: true, message: "Stock removed from watchlist" };
    } catch (error) {
        console.error("Error removing from watchlist:", error);
        throw new Error("Failed to remove stock from watchlist");
    }
};


/**
 * Get full watchlist for the logged-in user
 */
export const getUserWatchlist = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        // User not logged in → redirect
        if (!session?.user) redirect("/sign-in");

        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;

        if (!db) {
            throw new Error("MongoDB connection not found.");
        }

        const userId = session.user.id;

        // Fetch watchlist sorted by newest first
        const watchlist = await Watchlist.find({ userId })
            .sort({ addedAt: -1 })
            .lean();

        // Convert Mongoose docs → JSON
        return JSON.parse(JSON.stringify(watchlist));

    } catch (error) {
        console.error("Error fetching watchlist:", error);
        throw new Error("Failed to fetch watchlist");
    }
};


/**
 * Get user's full watchlist WITH live stock data
 */
/**
 * Get user's full watchlist WITH live stock data
 */

// export const getWatchlistWithData = async () => {
//     try {
//         const session = await auth.api.getSession({
//             headers: await headers(),
//         });
//
//         if (!session?.user) redirect("/sign-in");
//
//         const userId = session.user.id;
//
//         // Fetch raw watchlist
//         const watchlist = await Watchlist.find({ userId })
//             .sort({ addedAt: -1 })
//             .lean();
//
//         if (!watchlist.length) return [];
//
//         // Fetch stock details for each symbol
//         const stocksWithData = await Promise.all(
//             watchlist.map(async (item) => {
//                 const stockData = await getStocksDetails(item.symbol);
//
//                 if (!stockData) {
//                     console.warn(`Failed to fetch data for ${item.symbol}`);
//                     return item;
//                 }
//
//                 return {
//                     company: stockData.company,
//                     symbol: stockData.symbol,
//                     currentPrice: stockData.currentPrice,
//                     priceFormatted: stockData.priceFormatted,
//                     changeFormatted: stockData.changeFormatted,
//                     changePercent: stockData.changePercent,
//                     marketCap: stockData.marketCapFormatted,
//                     peRatio: stockData.peRatio,
//                 };
//             })
//         );
//
//         return JSON.parse(JSON.stringify(stocksWithData));
//     } catch (error) {
//         console.error("Error loading watchlist:", error);
//         throw new Error("Failed to fetch watchlist");
//     }
// };



// Get user's watchlist with stock data
export const getWatchlistWithData = async () => {
    try {
        // 1️⃣ CONNECT TO DATABASE (Missing earlier)
        await connectToDatabase();

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) redirect('/sign-in');

        // 2️⃣ Fetch user’s watchlist
        const watchlist = await Watchlist
            .find({ userId: session.user.id })
            .sort({ addedAt: -1 })
            .lean();

        if (watchlist.length === 0) return [];

        // 3️⃣ Fetch stock data for each symbol
        const stocksWithData = await Promise.all(
            watchlist.map(async (item) => {
                const stockData = await getStocksDetails(item.symbol);

                if (!stockData) {
                    console.warn(`Failed to fetch data for ${item.symbol}`);
                    return item;
                }

                return {
                    company: stockData.company,
                    symbol: stockData.symbol,
                    currentPrice: stockData.currentPrice,
                    priceFormatted: stockData.priceFormatted,
                    changeFormatted: stockData.changeFormatted,
                    changePercent: stockData.changePercent,
                    marketCap: stockData.marketCapFormatted,
                    peRatio: stockData.peRatio,
                };
            })
        );

        return JSON.parse(JSON.stringify(stocksWithData));

    } catch (error) {
        console.error("Error loading watchlist:", error);
        throw new Error("Failed to fetch watchlist");
    }
};
