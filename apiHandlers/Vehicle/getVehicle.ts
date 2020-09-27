import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import { getVehicle } from "../../mongodb/actions/Vehicle";
import { verifyTokenSecure } from "../../mongodb/actions/User";

// @route   GET api/vehicle
// @desc    Get Vehicle
// @access  Private
const handler: NowApiHandler = (req: NowRequest, res: NowResponse) =>
  verifyTokenSecure(req.query.token as string)
    .then((user) =>
      getVehicle(user, req.query as any).then((payload) =>
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