import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";

import {
    SYMBOL_INFO_WIDGET_CONFIG,
    CANDLE_CHART_WIDGET_CONFIG,
    BASELINE_WIDGET_CONFIG,
    TECHNICAL_ANALYSIS_WIDGET_CONFIG,
    COMPANY_PROFILE_WIDGET_CONFIG,
    COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

import { getStocksDetails } from "@/lib/actions/finnhub.actions";
import { getUserWatchlist } from "@/lib/actions/watchlist.actions";
import { notFound } from "next/navigation";

export default async function StockDetails({ params }) {
    const { symbol } = await params;
    const upperSymbol = symbol.toUpperCase();
    const scriptUrl = "https://s3.tradingview.com/external-embedding/embed-widget-";

    // --------------------------
    // 1️⃣ Fetch live stock data
    // --------------------------
    const stockData = await getStocksDetails(upperSymbol);

    if (!stockData) return notFound();

    // --------------------------
    // 2️⃣ Fetch user watchlist
    // --------------------------
    const watchlist = await getUserWatchlist();

    const isInWatchlist = watchlist.some(
        (item) => item.symbol === upperSymbol
    );

    return (
        <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">

                {/* LEFT COLUMN */}
                <div className="flex flex-col gap-6">

                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}symbol-info.js`}
                        config={SYMBOL_INFO_WIDGET_CONFIG(upperSymbol)}
                        height={170}
                    />

                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}advanced-chart.js`}
                        config={CANDLE_CHART_WIDGET_CONFIG(upperSymbol)}
                        className="custom-chart"
                        height={600}
                    />

                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}advanced-chart.js`}
                        config={BASELINE_WIDGET_CONFIG(upperSymbol)}
                        className="custom-chart"
                        height={600}
                    />
                </div>

                {/* RIGHT COLUMN */}
                <div className="flex flex-col gap-6">

                    {/* Watchlist Button */}
                    <div className="flex items-center justify-between">
                        <WatchlistButton
                            symbol={upperSymbol}
                            company={stockData.company}
                            isInWatchlist={isInWatchlist}
                            type="button"
                        />
                    </div>

                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}technical-analysis.js`}
                        config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(upperSymbol)}
                        height={400}
                    />

                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}company-profile.js`}
                        config={COMPANY_PROFILE_WIDGET_CONFIG(upperSymbol)}
                        height={440}
                    />

                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}financials.js`}
                        config={COMPANY_FINANCIALS_WIDGET_CONFIG(upperSymbol)}
                        height={464}
                    />
                </div>

            </section>
        </div>
    );
}
