import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import { createCharger } from "../../mongodb/actions/Charger";
import { verifyTokenSecure } from "../../mongodb/actions/User";

// @route   POST api/charger
// @desc    Create Charger
// @access  Private
const handler: NowApiHandler = (req: NowRequest, res: NowResponse) =>
  verifyTokenSecure(req.query.token as string)
    .then((user) =>
      createCharger(user, req.body ?? {}).then((payload) =>
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
