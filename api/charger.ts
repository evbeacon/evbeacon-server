import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import getCharger from "../apiHandlers/Charger/getChargers";
import createCharger from "../apiHandlers/Charger/createCharger";
import updateCharger from "../apiHandlers/Charger/updateCharger";
import deleteCharger from "../apiHandlers/Charger/deleteCharger";
import banCharger from "../apiHandlers/Charger/banCharger";

const handler: NowApiHandler = (req: NowRequest, res: NowResponse) => {
  if (req.method === "GET") {
    return getCharger(req, res);
  } else if (req.method === "POST") {
    return createCharger(req, res);
  } else if (req.method === "PATCH") {
    return updateCharger(req, res);
  } else if (req.method === "DELETE") {
    return deleteCharger(req, res);
  } else if (req.method === "PUT") {
    return banCharger(req, res);
  } else {
    return res.status(405).json({
      success: false,
      message: "Invalid http request!",
    });
  }
};

export default handler;
