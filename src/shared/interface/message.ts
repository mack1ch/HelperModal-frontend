export interface IMessage {
  id: string;
  text: string;
  authorId: string;
  issueId: string;
  createdAt: Date;
  fileLink?: string;
  page?: number;
}
