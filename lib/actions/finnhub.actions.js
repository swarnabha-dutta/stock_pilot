"use server";

import {
    getDateRange,
    validateArticle,
    formatArticle,
    formatPrice,
    formatChangePercent,
    formatMarketCapValue,
} from "@/lib/utils";

import { POPULAR_STOCK_SYMBOLS } from "@/lib/constants";
import { cache } from "react";

// Finnhub keys
const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const NEXT_PUBLIC_FINNHUB_API_KEY =
    process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? "";

// ---------------------------------------------------------
// JSON fetch wrapper
// ---------------------------------------------------------
async function fetchJSON(url, revalidateSeconds) {
    const options = revalidateSeconds
        ? { cache: "force-cache", next: { revalidate: revalidateSeconds } }
        : { cache: "no-store" };

    const res = await fetch(url, options);

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Fetch failed ${res.status}: ${text}`);
    }

    return await res.json();
}

export { fetchJSON };

// ---------------------------------------------------------
// 1️⃣ Fetch NEWS
// ---------------------------------------------------------
export async function getNews(symbols) {
    try {
        const range = getDateRange(5);
        const token = process.env.FINNHUB_API_KEY ?? NEXT_PUBLIC_FINNHUB_API_KEY;

        if (!token) throw new Error("FINNHUB API key is not configured");

        const cleanSymbols = (symbols || [])
            .map((s) => s?.trim().toUpperCase())
            .filter(Boolean);

        const maxArticles = 6;

        // -----------------------------
        // Company news
        // -----------------------------
        if (cleanSymbols.length > 0) {
            const perSymbolArticles = {};

            await Promise.all(
                cleanSymbols.map(async (sym) => {
                    try {
                        const url = `${FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(
                            sym
                        )}&from=${range.from}&to=${range.to}&token=${token}`;

                        const articles = await fetchJSON(url, 300);
                        perSymbolArticles[sym] = (articles || []).filter((a) =>
                            validateArticle(a)
                        );
                    } catch (e) {
                        console.error("Error fetching company news for", sym, e);
                        perSymbolArticles[sym] = [];
                    }
                })
            );

            const collected = [];

            for (let round = 0; round < maxArticles; round++) {
                for (let i = 0; i < cleanSymbols.length; i++) {
                    const sym = cleanSymbols[i];
                    const list = perSymbolArticles[sym] || [];

                    if (list.length === 0) continue;

                    const article = list.shift();
                    if (!validateArticle(article)) continue;

                    collected.push(formatArticle(article, true, sym, round));

                    if (collected.length >= maxArticles) break;
                }
                if (collected.length >= maxArticles) break;
            }

            if (collected.length > 0) {
                collected.sort((a, b) => (b.datetime || 0) - (a.datetime || 0));
                return collected.slice(0, maxArticles);
            }
        }

        // -----------------------------
        // Fallback → Market news
        // -----------------------------
        const generalUrl = `${FINNHUB_BASE_URL}/news?category=general&token=${token}`;
        const general = await fetchJSON(generalUrl, 300);

        const seen = new Set();
        const unique = [];

        for (const art of general || []) {
            if (!validateArticle(art)) continue;

            const key = `${art.id}-${art.url}-${art.headline}`;
            if (seen.has(key)) continue;

            seen.add(key);
            unique.push(art);

            if (unique.length >= 20) break;
        }

        return unique
            .slice(0, maxArticles)
            .map((a, idx) => formatArticle(a, false, undefined, idx));
    } catch (err) {
        console.error("getNews error:", err);
        throw new Error("Failed to fetch news");
    }
}

// ---------------------------------------------------------
// 2️⃣ Search stocks
// ---------------------------------------------------------
export const searchStocks = cache(async (query) => {
    try {
        const token = process.env.FINNHUB_API_KEY ?? NEXT_PUBLIC_FINNHUB_API_KEY;
        if (!token) {
            console.error(
                "Error in stock search:",
                new Error("FINNHUB API key is not configured")
            );
            return [];
        }

        const trimmed = typeof query === "string" ? query.trim() : "";
        let results = [];

        // -----------------------------
        // No query → show popular stocks
        // -----------------------------
        if (!trimmed) {
            const top = POPULAR_STOCK_SYMBOLS.slice(0, 10);

            const profiles = await Promise.all(
                top.map(async (sym) => {
                    try {
                        const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(
                            sym
                        )}&token=${token}`;
                        const profile = await fetchJSON(url, 3600);
                        return { sym, profile };
                    } catch (e) {
                        console.error("Error fetching profile2 for", sym, e);
                        return { sym, profile: null };
                    }
                })
            );

            results = profiles
                .map(({ sym, profile }) => {
                    const symbol = sym.toUpperCase();
                    const name = profile?.name || profile?.ticker;
                    if (!name) return undefined;

                    return {
                        symbol,
                        name,
                        description: name,
                        displaySymbol: symbol,
                        type: "Common Stock",
                        __exchange: profile?.exchange,
                    };
                })
                .filter(Boolean);
        } else {
            // -----------------------------
            // Query search
            // -----------------------------
            const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(
                trimmed
            )}&token=${token}`;

            const data = await fetchJSON(url, 1800);
            results = Array.isArray(data?.result) ? data.result : [];
        }

        // Final mapping
        return results
            .map((r) => {
                const upper = (r.symbol || "").toUpperCase();
                const name = r.description || upper;

                return {
                    symbol: upper,
                    name,
                    exchange: r.displaySymbol || r.__exchange || "US",
                    type: r.type || "Stock",
                    isInWatchlist: false,
                };
            })
            .slice(0, 15);
    } catch (err) {
        console.error("Error in stock search:", err);
        throw new Error(`Failed to search stocks: ${err.message}`);
    }
});

// ---------------------------------------------------------
// 3️⃣ Get Stock Details (Converted to JS)
// ---------------------------------------------------------
export const getStocksDetails = cache(async (symbol) => {
    const cleanSymbol = symbol.trim().toUpperCase();

    try {
        const [quote, profile, financials] = await Promise.all([
            // Price — no cache
            fetchJSON(
                `${FINNHUB_BASE_URL}/quote?symbol=${cleanSymbol}&token=${NEXT_PUBLIC_FINNHUB_API_KEY}`
            ),

            // Profile — cache 1hr
            fetchJSON(
                `${FINNHUB_BASE_URL}/stock/profile2?symbol=${cleanSymbol}&token=${NEXT_PUBLIC_FINNHUB_API_KEY}`,
                3600
            ),

            // Financial metrics — cache 30min
            fetchJSON(
                `${FINNHUB_BASE_URL}/stock/metric?symbol=${cleanSymbol}&metric=all&token=${NEXT_PUBLIC_FINNHUB_API_KEY}`,
                1800
            ),
        ]);

        if (!quote?.c || !profile?.name)
            throw new Error("Invalid stock data received from API");

        const changePercent = quote.dp || 0;
        const peRatio = financials?.metric?.peNormalizedAnnual || null;

        return {
            symbol: cleanSymbol,
            company: profile.name,
            currentPrice: quote.c,
            changePercent,
            priceFormatted: formatPrice(quote.c),
            changeFormatted: formatChangePercent(changePercent),
            peRatio: peRatio ? peRatio.toFixed(1) : "—",
            marketCapFormatted: formatMarketCapValue(
                profile.marketCapitalization || 0
            ),
        };
    } catch (err) {
        console.error(`Error fetching details for ${cleanSymbol}:`, err);
        throw new Error("Failed to fetch stock details");
    }
});
