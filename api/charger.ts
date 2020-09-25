import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import getCharger from "../apiHandlers/Charger/getCharger";
import createCharger from "../apiHandlers/Charger/createCharger";
import updateCharger from "../apiHandlers/Charger/updateCharger";
import deleteCharger from "../apiHandlers/Charger/deleteCharger";
import banCharger from "../apiHandlers/Charger/banCharger";

const handler: NowApiHandler = (req: NowRequest, res: NowResponse) => {
  if (req.method === "get") {
    return getCharger(req, res);
  } else if (req.method === "post") {
    return createCharger(req, res);
  } else if (req.method === "patch") {
    return updateCharger(req, res);
  } else if (req.method === "delete") {
    return deleteCharger(req, res);
  } else if (req.method === "put") {
    return banCharger(req, res);
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid http request!",
    });
  }
};

export default handler;
