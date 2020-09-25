import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import { updateReport } from "../../mongodb/actions/Report";

const handler: NowApiHandler = (req: NowRequest, res: NowResponse) =>
  updateReport(req.body)
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
