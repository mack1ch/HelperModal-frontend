import { IIssue } from "@/shared/interface/issue";

const ONE_HOUR = 60 * 60 * 1000; // in milliseconds

export const closeOldIssues = (issues: IIssue[]): boolean => {
  const now = new Date().getTime();
  let answer = false;
  issues.forEach((issue) => {
    if (
      !issue.isClosed &&
      now - new Date(issue.createdAt || new Date()).getTime() > ONE_HOUR
    ) {
      answer = true;
    } else answer = false;
  });
  return answer;
};
