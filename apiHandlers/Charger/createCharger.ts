import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import { createCharger } from "../../mongodb/actions/Charger";

const handler: NowApiHandler = (req: NowRequest, res: NowResponse) =>
  createCharger(req.body)
    .then((payload) =>
      res.status(200).json({
        success: true,
        payload,
      })
    )
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: error.message,
      })
    );

export default handler;
