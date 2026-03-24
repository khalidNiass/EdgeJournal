export type TradeRow = {
  id: number;
  date: string | Date;
  pair: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskPercent: number;
  positionType: string;
  result: string | null;
  strategy?: string | null;
  notes?: string | null;
  beforeImg?: string | null;
  afterImg?: string | null;
  exitTime?: string | null;
  isDemo?: boolean;
};

export const demoBeforeImg =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200' viewBox='0 0 320 200'><defs><linearGradient id='b' x1='0' x2='1'><stop offset='0' stop-color='%23e2e8f0'/><stop offset='1' stop-color='%23cbd5f5'/></linearGradient></defs><rect width='320' height='200' rx='14' fill='url(%23b)'/><path d='M20 150 L80 110 L120 130 L170 80 L220 120 L280 70' stroke='%236366f1' stroke-width='6' fill='none'/><circle cx='80' cy='110' r='5' fill='%236366f1'/><circle cx='170' cy='80' r='5' fill='%236366f1'/><circle cx='280' cy='70' r='5' fill='%236366f1'/></svg>";

export const demoAfterImg =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200' viewBox='0 0 320 200'><defs><linearGradient id='a' x1='0' x2='1'><stop offset='0' stop-color='%23d1fae5'/><stop offset='1' stop-color='%23a7f3d0'/></linearGradient></defs><rect width='320' height='200' rx='14' fill='url(%23a)'/><path d='M20 160 L70 120 L110 140 L160 90 L210 120 L260 60 L300 40' stroke='%23059669' stroke-width='6' fill='none'/><circle cx='70' cy='120' r='5' fill='%23059669'/><circle cx='160' cy='90' r='5' fill='%23059669'/><circle cx='300' cy='40' r='5' fill='%23059669'/></svg>";

export const demoTrades: TradeRow[] = [
  {
    id: 10001,
    date: "2026-03-18T09:30:00Z",
    exitTime: "2026-03-18T11:05:00Z",
    pair: "EURUSD",
    entryPrice: 1.0942,
    stopLoss: 1.0912,
    takeProfit: 1.1006,
    riskPercent: 1,
    positionType: "long",
    result: "win",
    strategy: "London Breakout",
    notes: "Clean break above session high, held for 1:2 RR.",
    beforeImg: demoBeforeImg,
    afterImg: demoAfterImg,
    isDemo: true,
  },
  {
    id: 10002,
    date: "2026-03-19T14:15:00Z",
    exitTime: "2026-03-19T15:05:00Z",
    pair: "BTCUSD",
    entryPrice: 68450,
    stopLoss: 69200,
    takeProfit: 66500,
    riskPercent: 1.5,
    positionType: "short",
    result: "loss",
    strategy: "Range Fade",
    notes: "Faded resistance, got stopped after news spike.",
    beforeImg: demoBeforeImg,
    afterImg: demoAfterImg,
    isDemo: true,
  },
  {
    id: 10003,
    date: "2026-03-20T12:00:00Z",
    exitTime: "2026-03-20T13:20:00Z",
    pair: "XAUUSD",
    entryPrice: 2178.6,
    stopLoss: 2168.4,
    takeProfit: 2196.2,
    riskPercent: 0.8,
    positionType: "long",
    result: "breakeven",
    strategy: "Trend Pullback",
    notes: "Moved to BE after first target; reversed on data.",
    beforeImg: demoBeforeImg,
    afterImg: demoAfterImg,
    isDemo: true,
  },
  {
    id: 10004,
    date: "2026-03-21T16:40:00Z",
    exitTime: "2026-03-21T18:10:00Z",
    pair: "GBPJPY",
    entryPrice: 191.32,
    stopLoss: 192.1,
    takeProfit: 189.7,
    riskPercent: 1.2,
    positionType: "short",
    result: "win",
    strategy: "S/R Rejection",
    notes: "Rejection at daily level with confirmation.",
    beforeImg: demoBeforeImg,
    afterImg: demoAfterImg,
    isDemo: true,
  },
  {
    id: 10005,
    date: "2026-03-22T08:05:00Z",
    exitTime: "2026-03-22T10:35:00Z",
    pair: "AAPL",
    entryPrice: 216.4,
    stopLoss: 212.9,
    takeProfit: 223.0,
    riskPercent: 0.6,
    positionType: "long",
    result: "open",
    strategy: "Gap & Go",
    notes: "Partial at 1R, runner still open.",
    beforeImg: demoBeforeImg,
    afterImg: demoAfterImg,
    isDemo: true,
  },
];
