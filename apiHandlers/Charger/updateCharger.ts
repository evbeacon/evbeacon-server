import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import { updateCharger } from "../../mongodb/actions/Charger";
import { verifyTokenSecure } from "../../mongodb/utils/Auth";

// @route   PATCH api/charger
// @desc    Update Charger
// @access  Private
const handler: NowApiHandler = (req: NowRequest, res: NowResponse) =>
  verifyTokenSecure(req.query.token as string)
    .then((user) =>
      updateCharger(user, req.body ?? {}).then((payload) =>
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
