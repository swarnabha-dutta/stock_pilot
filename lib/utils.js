import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diffInMs = now - timestamp * 1000;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInHours > 24) {
        const days = Math.floor(diffInHours / 24);
        return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (diffInHours >= 1) {
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    }
};

export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatMarketCapValue(marketCapUsd) {
    if (!Number.isFinite(marketCapUsd) || marketCapUsd <= 0) return "N/A";

    if (marketCapUsd >= 1e12) return `$${(marketCapUsd / 1e12).toFixed(2)}T`;
    if (marketCapUsd >= 1e9) return `$${(marketCapUsd / 1e9).toFixed(2)}B`;
    if (marketCapUsd >= 1e6) return `$${(marketCapUsd / 1e6).toFixed(2)}M`;
    return `$${marketCapUsd.toFixed(2)}`;
}

export const getDateRange = (days) => {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - days);

    return {
        to: toDate.toISOString().split("T")[0],
        from: fromDate.toISOString().split("T")[0],
    };
};

export const getTodayDateRange = () => {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    return {
        to: todayString,
        from: todayString,
    };
};

export const calculateNewsDistribution = (symbolsCount) => {
    let itemsPerSymbol;
    let targetNewsCount = 6;

    if (symbolsCount < 3) {
        itemsPerSymbol = 3;
    } else if (symbolsCount === 3) {
        itemsPerSymbol = 2;
    } else {
        itemsPerSymbol = 1;
        targetNewsCount = 6;
    }

    return { itemsPerSymbol, targetNewsCount };
};

export const validateArticle = (article) =>
    article.headline && article.summary && article.url && article.datetime;

export const getTodayString = () =>
    new Date().toISOString().split("T")[0];

export const formatArticle = (article, isCompanyNews, symbol, index = 0) => ({
    id: isCompanyNews
        ? Date.now() + Math.random()
        : article.id + index,
    headline: article.headline.trim(),
    summary:
        article.summary.trim().substring(0, isCompanyNews ? 200 : 150) +
        "...",
    source:
        article.source || (isCompanyNews ? "Company News" : "Market News"),
    url: article.url,
    datetime: article.datetime,
    image: article.image || "",
    category: isCompanyNews ? "company" : article.category || "general",
    related: isCompanyNews ? symbol : article.related || "",
});

export const formatChangePercent = (changePercent) => {
    if (!changePercent) return "";
    const sign = changePercent > 0 ? "+" : "";
    return `${sign}${changePercent.toFixed(2)}%`;
};

export const getChangeColorClass = (changePercent) => {
    if (!changePercent) return "text-gray-400";
    return changePercent > 0 ? "text-green-500" : "text-red-500";
};

export const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(price);
};

export const formatDateToday = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
});

export const getAlertText = (alert) => {
    const condition = alert.alertType === "upper" ? ">" : "<";
    return `Price ${condition} ${formatPrice(alert.threshold)}`;
};

export const getFormattedTodayDate = () =>
    new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
