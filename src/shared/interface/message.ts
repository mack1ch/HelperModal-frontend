export interface IMessage {
  text: string;
  id: string;
  documents?: IDocument[];
  createdAt: Date;
  issueId: string;
  authorId: string;
  role: "AI" | "operator" | "user";
  userRating: 'like' | 'dislike'
}

export interface IDocument {
  fileLink?: string;
  page?: number;
  title?: string;
}
