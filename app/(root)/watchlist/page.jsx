import { Star } from "lucide-react";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import SearchCommand from "@/components/SearchCommand";
import { getWatchlistWithData } from "@/lib/actions/watchlist.actions";
import  WatchlistTable  from "@/components/WatchlistTable";

export default async function Watchlist() {
    const watchlist = await getWatchlistWithData();   // ⬅ server DB theke data
    const initialStocks = await searchStocks();       // ⬅ search suggestions

    // -----------------------------
    // Empty UI
    // -----------------------------
    if (watchlist.length === 0) {
        return (
            <section className="flex watchlist-empty-container">
                <div className="watchlist-empty">
                    <Star className="watchlist-star" />
                    <h2 className="empty-title">Your watchlist is empty</h2>
                    <p className="empty-description">
                        Start building your watchlist by searching for stocks and clicking
                        the star icon to add them.
                    </p>
                </div>

                <SearchCommand initialStocks={initialStocks} />
            </section>
        );
    }

    // -----------------------------
    // Watchlist Table UI
    // -----------------------------
    return (
        <section className="watchlist">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h2 className="watchlist-title">Watchlist</h2>
                    <SearchCommand initialStocks={initialStocks} />
                </div>

                <WatchlistTable watchlist={watchlist} />
            </div>
        </section>
    );
}
