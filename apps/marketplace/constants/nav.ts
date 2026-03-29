
export const NAV_KEYS = {
  HOME: 'HOME',
  BUY_SELL: 'BUY_SELL',
  DRIVER_JOBS: 'DRIVER_JOBS',
} as const;

export type NavKey = keyof typeof NAV_KEYS;
