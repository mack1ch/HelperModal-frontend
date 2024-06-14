export interface IEmailForm {
  name: string;
  email: string;
  text: string;
  filesName: string[];
}

export interface IEmailFilesRes {
  id: number;
  name: string;
  originalName: string;
  mimeType: string;
}
