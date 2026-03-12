export type ShiftDto = {
  id: number;
  code: string;
  status: string;
  openedAt: string;
  closedAt?: string | null;
  openingCash: number;
  revenue: number;

  expectedCash?: number | null;
  countedCash?: number | null;
  difference?: number | null;
};