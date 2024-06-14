import { instance } from "@/shared/api/restAPI";
import { IEmailFilesRes, IEmailForm } from "../interface";

export const postEmailByAuthorID = async (
  formData: IEmailForm,
  authorID: string
): Promise<any | Error> => {
  try {
    const { data }: { data: any } = await instance.post(`/mail/send`, {
      authorId: authorID,
      name: formData.name,
      email: formData.email,
    });

    return data;
  } catch (error) {
    return error as Error;
  }
};

export const postFiles = async (
  files: any
): Promise<IEmailFilesRes | Error> => {
  try {
    const { data }: { data: IEmailFilesRes } = await instance.post(
      `/files`,
      files,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  } catch (error) {
    return error as Error;
  }
};
