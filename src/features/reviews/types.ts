export type ReviewUpdateRequest = {
  title: string;
  content: string;
  rating?: number | null;
  readPage?: number | null;
};
