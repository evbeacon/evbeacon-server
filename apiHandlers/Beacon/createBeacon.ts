import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import { createBeacon } from "../../mongodb/actions/Beacon";
import { verifyTokenSecure } from "../../mongodb/utils/Auth";

// @route   POST api/beacon
// @desc    Create Beacon
// @access  Private
const handler: NowApiHandler = (req: NowRequest, res: NowResponse) =>
  verifyTokenSecure(req.query.token as string)
    .then((user) =>
      createBeacon(user, req.body ?? {}).then((payload) =>
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
