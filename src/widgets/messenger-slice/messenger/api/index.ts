import { instance } from "@/shared/api/restAPI";
import { IIssue } from "@/shared/interface/issue";

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
  authorID: string
): Promise<IIssue[] | Error> => {
  try {
    const { data }: { data: IIssue[] } = await instance.get(
      `/issues?authorId=${authorID}`
    );

    return data;
  } catch (error) {
    return error as Error;
  }
};
