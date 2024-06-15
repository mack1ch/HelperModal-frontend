export interface IMessage {
  id: string;
  text: string;
  authorId: string;
  issueId: string;
  createdAt: Date;
  documents?: IDocument[];
}

export interface IDocument {
  fileLink?: string;
  page?: number;
  title?: string;
}
