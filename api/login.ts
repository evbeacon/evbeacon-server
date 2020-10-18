import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import login from "../apiHandlers/Auth/login";

const handler: NowApiHandler = (req: NowRequest, res: NowResponse) => {
  if (req.method === "POST") {
    return login(req, res);
  } else {
    return res.status(405).json({
      success: false,
      message: "Invalid http request!",
    });
  }
};

export default handler;
