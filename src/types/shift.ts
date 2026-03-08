export type ShiftDto = {
  id: number;
  code: string;
  status: number; // ✅ đổi string -> number
  openedAt: string;
  closedAt?: string | null;
  openingCash: number;
  revenue: number;

  expectedCash?: number | null;
  countedCash?: number | null;
  difference?: number | null;
};