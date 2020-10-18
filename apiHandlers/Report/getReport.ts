import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import { getReport } from "../../mongodb/actions/Report";
import { verifyTokenSecure } from "../../mongodb/utils/Auth";

// @route   GET api/report
// @desc    Get Report
// @access  Private
const handler: NowApiHandler = (req: NowRequest, res: NowResponse) =>
  verifyTokenSecure(req.query.token as string)
    .then((user) =>
      getReport(user, req.query as any).then((payload) =>
        res.status(200).json({
          success: true,
          payload,
        })
      )
    )
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: error.message,
      })
    );

export default handler;
