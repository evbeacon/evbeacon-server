import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import getUser from "../apiHandlers/User/getUser";
import signUp from "../apiHandlers/User/signUp";
import login from "../apiHandlers/User/login";
import updateUser from "../apiHandlers/User/updateUser";
import banUser from "../apiHandlers/User/banUser";

const handler: NowApiHandler = (req: NowRequest, res: NowResponse) => {
  if (req.method === "get") {
    return getUser(req, res);
  } else if (req.method === "post") {
    return signUp(req, res);
  } else if (req.method === "head") {
    return login(req, res);
  } else if (req.method === "patch") {
    return updateUser(req, res);
  } else if (req.method === "put") {
    return banUser(req, res);
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid http request!",
    });
  }
};

export default handler;
