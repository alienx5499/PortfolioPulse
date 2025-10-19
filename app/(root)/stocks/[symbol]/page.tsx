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

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8 cyber-wrapper">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <div className="cyber-card p-4">
            <h2 className="cyber-title text-xl mb-4">STOCK ANALYSIS: {symbol.toUpperCase()}</h2>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}symbol-info.js`}
              config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
              height={170}
            />
          </div>

          <div className="cyber-card p-4">
            <h2 className="cyber-title text-xl mb-4">PRICE CHART</h2>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}advanced-chart.js`}
              config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
              className="custom-chart"
              height={600}
            />
          </div>

          <div className="cyber-card p-4">
            <h2 className="cyber-title text-xl mb-4">TECHNICAL ANALYSIS</h2>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}advanced-chart.js`}
              config={BASELINE_WIDGET_CONFIG(symbol)}
              className="custom-chart"
              height={600}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <div className="cyber-card p-4">
            <h2 className="cyber-title text-xl mb-4">PORTFOLIO ACTIONS</h2>
            <WatchlistButton symbol={symbol.toUpperCase()} company={symbol.toUpperCase()} isInWatchlist={false} />
          </div>

          <div className="cyber-card p-4">
            <h2 className="cyber-title text-xl mb-4">TECHNICAL INDICATORS</h2>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}technical-analysis.js`}
              config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
              height={400}
            />
          </div>

          <div className="cyber-card p-4">
            <h2 className="cyber-title text-xl mb-4">COMPANY PROFILE</h2>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}company-profile.js`}
              config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
              height={440}
            />
          </div>

          <div className="cyber-card p-4">
            <h2 className="cyber-title text-xl mb-4">FINANCIAL DATA</h2>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}financials.js`}
              config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
              height={464}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
