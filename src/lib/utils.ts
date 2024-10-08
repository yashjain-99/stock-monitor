import { StockData } from "@/types/api";

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US").format(price);
};

export const calculatePercentChange = (
  priceChange: number,
  lastTradingPrice: number
): number => {
  return (priceChange / lastTradingPrice) * 100;
};

export const formatStockData = (
  data: StockData
): {
  lastTradingPrice: number;
  closingPrices: { time: number; value: number }[];
  priceChange: number;
  volume: { time: number; value: number; color: string }[];
} => {
  const closingPrices: { time: number; value: number }[] = [];
  const volume: { time: number; value: number; color: string }[] = [];

  let lastTradingPrice = 0;
  let priceChange = 0;

  const closingPricesEntries = Object.entries(data["data"]);

  closingPricesEntries.forEach((entry, idx) => {
    const tradingPrice = parseFloat(entry[1]["close"]);
    const tradingVolume = parseInt(entry[1]["volume"], 10);
    const timestamp = Date.parse(entry[0]) / 1000;

    // Collect closing prices and volume
    closingPrices.push({ time: timestamp, value: tradingPrice });
    volume.push({ time: timestamp, value: tradingVolume, color: "#fe6865" });

    // Set last trading price and price change for the first two entries
    if (idx === 0) {
      lastTradingPrice = tradingPrice;
    } else if (idx === 1) {
      priceChange = tradingPrice - lastTradingPrice;
    }
  });

  // Reverse and set color based on volume
  for (let i = closingPrices.length - 1; i >= 0; i--) {
    const tradingVolume = volume[i];

    // Assign color based on volume comparison
    if (i < closingPrices.length - 1) {
      tradingVolume.color =
        tradingVolume.value < volume[i + 1].value ? "#fe6865" : "#83f28f";
    }
  }

  // Reverse the arrays at the end
  closingPrices.reverse();
  volume.reverse();

  return { lastTradingPrice, closingPrices, priceChange, volume };
};
