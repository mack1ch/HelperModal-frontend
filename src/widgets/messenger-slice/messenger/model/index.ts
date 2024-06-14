import { IIssue } from "@/shared/interface/issue";

const TWO_HOURS = 2 * 60 * 60 * 1000; // Two hours in milliseconds

export const closeOldIssues = (issues: IIssue[]): boolean => {
  const now = new Date().getTime();
  let answer = false;
  issues.forEach((issue) => {
    if (
      !issue.isClosed &&
      now - new Date(issue.createdAt).getTime() > TWO_HOURS
    ) {
      answer = true;
    } else answer = false;
  });
  return answer;
};
