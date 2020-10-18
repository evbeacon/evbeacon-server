import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import { updateBeaconCharger } from "../../mongodb/actions/Beacon";
import { verifyTokenSecure } from "../../mongodb/utils/Auth";

// @route   PATCH api/beacon
// @desc    Update Beacon Charger
// @access  Private
const handler: NowApiHandler = (req: NowRequest, res: NowResponse) =>
  verifyTokenSecure(req.query.token as string)
    .then((user) =>
      updateBeaconCharger(user, req.body ?? {}).then((payload) =>
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
