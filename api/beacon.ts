import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import getBeacon from "../apiHandlers/Beacon/getBeacon";
import createBeacon from "../apiHandlers/Beacon/createBeacon";
import updateBeaconCharger from "../apiHandlers/Beacon/updateBeaconCharger";
import cancelBeacon from "../apiHandlers/Beacon/cancelBeacon";

const handler: NowApiHandler = (req: NowRequest, res: NowResponse) => {
  if (req.method === "get") {
    return getBeacon(req, res);
  } else if (req.method === "post") {
    return createBeacon(req, res);
  } else if (req.method === "patch") {
    return updateBeaconCharger(req, res);
  } else if (req.method === "delete") {
    return cancelBeacon(req, res);
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid http request!",
    });
  }
};

export default handler;
