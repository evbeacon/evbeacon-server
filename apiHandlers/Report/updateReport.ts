import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import { updateReport } from "../../mongodb/actions/Report";
import { verifyTokenSecure } from "../../mongodb/utils/Auth";

// @route   PATCH api/report
// @desc    Update Report
// @access  Private
const handler: NowApiHandler = (req: NowRequest, res: NowResponse) =>
  verifyTokenSecure(req.query.token as string)
    .then((user) =>
      updateReport(user, req.body ?? {}).then((payload) =>
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
