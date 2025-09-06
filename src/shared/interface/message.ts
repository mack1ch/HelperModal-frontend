export interface IMessage {
  text: string;
  id: string;
  documents?: IDocument[];
  createdAt: Date;
  issueId: string;
  authorId: string;
  role: "AI" | "operator" | "user";
  userReaction: "like" | "dislike" | undefined;
  isShortAnswer: boolean;
  companyType: "physic" | "msp" | "big_company";
}

export interface IDocument {
  fileLink?: string;
  page?: number;
  link?: string;
  title?: string;
}
