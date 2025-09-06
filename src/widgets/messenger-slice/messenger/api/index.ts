import { instance } from "@/shared/api/restAPI";
import { IIssue } from "@/shared/interface/issue";
import { normalizeIssue } from "../model";
import { AxiosError } from "axios";

export const changeIssueClosingByID = async (
  issueID: string,
  isClosed: boolean
): Promise<IIssue | Error> => {
  try {
    const { data }: { data: IIssue } = await instance.patch(
      `/issues/${issueID}`,
      {
        isClosed: isClosed,
      }
    );

    return data;
  } catch (error) {
    return error as Error;
  }
};

export const getIssuesByAuthorID = async (
  authorId: string,
  opts?: { signal?: AbortSignal } // опционально: отмена запроса
): Promise<IIssue[] | Error> => {
  try {
    const { data } = await instance.get<IIssue[]>("/issues", {
      params: { authorId },
      signal: opts?.signal,
    });

    if (!Array.isArray(data)) {
      return new Error("Invalid response shape: expected array");
    }

    const normalized = data.map(normalizeIssue);

    // Сортируем по updatedAt по возрастанию, чтобы последний был самый новый
    normalized.sort((a, b) => {
      const ad = a.updatedAt ? +new Date(a.updatedAt) : 0;
      const bd = b.updatedAt ? +new Date(b.updatedAt) : 0;
      return ad - bd;
    });

    return normalized;
  } catch (e) {
    const err = e as AxiosError;
    const msg =
      err.response?.data && typeof err.response.data === "object"
        ? JSON.stringify(err.response.data)
        : err.message || "Request failed";
    return new Error(`getIssuesByAuthorID failed: ${msg}`);
  }
};
