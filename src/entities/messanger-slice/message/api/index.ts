import { instance } from "@/shared/api/restAPI";

export type UserReaction = "like" | "dislike";

export interface RateMessagePayload {
  messageId: string;
  issueId: string;
  authorId: string;
  userReaction?: UserReaction; // если undefined — реакция удаляется
}

export async function rateMessage(payload: RateMessagePayload) {
  const { data } = await instance.post("/message/rate", payload);
  return data as { ok: boolean };
}
