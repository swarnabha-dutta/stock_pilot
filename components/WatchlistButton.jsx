"use client";

import React, { useMemo, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import {
    addToWatchlist,
    removeFromWatchlist,
} from "@/lib/actions/watchlist.actions";

const WatchlistButton = ({
                             symbol,
                             company,
                             isInWatchlist,
                             showTrashIcon = false,
                             type = "button",
                             onWatchlistChange,
                         }) => {
    const [added, setAdded] = useState(!!isInWatchlist);

    const label = useMemo(() => {
        if (type === "icon") return "";
        return added ? "Remove from Watchlist" : "Add to Watchlist";
    }, [added, type]);

    // --- API Handler ---
    const toggleWatchlist = async () => {
        const result = added
            ? await removeFromWatchlist(symbol)
            : await addToWatchlist(symbol, company);

        if (result?.success) {
            toast.success(added ? "Removed from Watchlist" : "Added to Watchlist", {
                description: `${company} ${
                    added ? "removed from" : "added to"
                } your watchlist`,
            });

            onWatchlistChange?.(symbol, !added);
        }
    };

    const debouncedToggle = useDebounce(toggleWatchlist, 300);

    // --- Click Handler ---
    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setAdded((prev) => !prev);
        debouncedToggle();
    };

    // ⭐ ICON BUTTON
    if (type === "icon") {
        return (
            <button
                title={
                    added
                        ? `Remove ${symbol} from watchlist`
                        : `Add ${symbol} to watchlist`
                }
                aria-label={
                    added
                        ? `Remove ${symbol} from watchlist`
                        : `Add ${symbol} to watchlist`
                }
                className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : ""}`}
                onClick={handleClick}
            >
                <Star fill={added ? "currentColor" : "none"} />
            </button>
        );
    }

    // ⭐ NORMAL BUTTON
    return (
        <button
            className={`watchlist-btn ${added ? "watchlist-remove" : ""}`}
            onClick={handleClick}
        >
            {showTrashIcon && added ? <Trash2 className="mr-2" /> : null}
            <span>{label}</span>
        </button>
    );
};

export default WatchlistButton;
