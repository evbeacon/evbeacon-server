import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import { deleteVehicle } from "../../mongodb/actions/Vehicle";
import { verifyTokenSecure } from "../../mongodb/actions/User";

// @route   DELETE api/vehicle
// @desc    Delete Vehicle
// @access  Private
const handler: NowApiHandler = (req: NowRequest, res: NowResponse) =>
  verifyTokenSecure(req.query.token as string)
    .then((user) =>
      deleteVehicle(user, req.body ?? {}).then((payload) =>
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
