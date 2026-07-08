export type FeedbackEntry = {
  id: string;
  kind: "idea" | "bug" | "otro";
  message: string;
  pathname: string;
  createdAt: string;
};

export const FEEDBACK_STORAGE_KEY = "amiko_feedback_queue";
