export interface ExhibitionInput {
  societyName: string;
  title: string; // may be empty
  startDate: string; // ISO YYYY-MM-DD
  endDate: string; // ISO YYYY-MM-DD
}

export interface Exhibition extends ExhibitionInput {
  id: string;
  createdAt: string; // ISO timestamp
}

export const DEFAULT_SOCIETY_NAME = "Welland Valley Art Society";
