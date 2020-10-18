import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import getUser from "../apiHandlers/User/getUser";
import updateUser from "../apiHandlers/User/updateUser";
import banUser from "../apiHandlers/User/banUser";

const handler: NowApiHandler = (req: NowRequest, res: NowResponse) => {
  if (req.method === "GET") {
    return getUser(req, res);
  } else if (req.method === "PATCH") {
    return updateUser(req, res);
  } else if (req.method === "PUT") {
    return banUser(req, res);
  } else {
    return res.status(405).json({
      success: false,
      message: "Invalid http request!",
    });
  }
};

export default handler;
