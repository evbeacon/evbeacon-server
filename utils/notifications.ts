import {
  Expo,
  ExpoPushToken,
  ExpoPushMessage,
  ExpoPushTicket,
} from "expo-server-sdk";
import { getUser } from "../mongodb/actions/User";
import type { UserType } from "../types/user";

interface TokenType {
  pushToken?: string;
  userId?: UserType["_id"];
}

const accessToken = process.env.EXPO_ACCESS_TOKEN;
const expo = new Expo({
  ...(accessToken != null && {
    accessToken,
  }),
});

export const sendNotification = async ({
  recepient,
  recepients,
  message,
}: {
  recepient?: TokenType;
  recepients?: TokenType[];
  message: Omit<ExpoPushMessage, "to">;
}): Promise<ExpoPushTicket[]> => {
  if (recepient == null && recepients == null) {
    throw new Error("Recipient(s) must be defined!");
  }

  const sendTo: ExpoPushToken[] = [];

  await Promise.all(
    (recepients === null ? [recepient!] : recepients!).map(async (i) => {
      if (i == null) {
        return;
      }

      if (i.pushToken != null) {
        sendTo.push(i.pushToken);
      } else {
        const user = await getUser(null as any, { _id: i.userId });

        if (user.expoPushToken) {
          sendTo.push(user.expoPushToken);
        }
      }
    })
  );

  sendTo?.forEach((receiver) => {
    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(receiver)) {
      throw new Error(`Push token ${receiver} is not a valid Expo push token`);
    }
  });

  const messages = [];
  messages.push({
    ...message,
    to: sendTo,
  });

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  for (const chunk of chunks) {
    const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
    // eslint-disable-next-line no-console
    console.log(ticketChunk);
    tickets.push(...ticketChunk);
  }

  return tickets;
};
