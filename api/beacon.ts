import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import getBeacon from "../apiHandlers/Beacon/getBeacon";
import createBeacon from "../apiHandlers/Beacon/createBeacon";
import updateBeaconCharger from "../apiHandlers/Beacon/updateBeaconCharger";
import cancelBeacon from "../apiHandlers/Beacon/cancelBeacon";

const handler: NowApiHandler = (req: NowRequest, res: NowResponse) => {
  if (req.method === "GET") {
    return getBeacon(req, res);
  } else if (req.method === "POST") {
    return createBeacon(req, res);
  } else if (req.method === "PATCH") {
    return updateBeaconCharger(req, res);
  } else if (req.method === "PUT") {
    return cancelBeacon(req, res);
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid http request!",
    });
  }
};

export default handler;
