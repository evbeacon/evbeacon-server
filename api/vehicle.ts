import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import getVehicle from "../apiHandlers/Vehicle/getVehicle";
import createVehicle from "../apiHandlers/Vehicle/createVehicle";
import updateVehicle from "../apiHandlers/Vehicle/updateVehicle";
import deleteVehicle from "../apiHandlers/Vehicle/deleteVehicle";
import banVehicle from "../apiHandlers/Vehicle/banVehicle";

const handler: NowApiHandler = (req: NowRequest, res: NowResponse) => {
  if (req.method === "get") {
    return getVehicle(req, res);
  } else if (req.method === "post") {
    return createVehicle(req, res);
  } else if (req.method === "patch") {
    return updateVehicle(req, res);
  } else if (req.method === "delete") {
    return deleteVehicle(req, res);
  } else if (req.method === "put") {
    return banVehicle(req, res);
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid http request!",
    });
  }
};

export default handler;
