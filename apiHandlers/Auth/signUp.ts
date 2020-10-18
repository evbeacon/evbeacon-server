import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import { signUp } from "../../mongodb/actions/Auth";

// @route   POST signup
// @desc    Create User
// @access  Public
const handler: NowApiHandler = (req: NowRequest, res: NowResponse) =>
  signUp(req.body ?? {})
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
