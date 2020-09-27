import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import { login } from "../../mongodb/actions/User";

// @route   POST login
// @desc    Login User
// @access  Public
const handler: NowApiHandler = (req: NowRequest, res: NowResponse) =>
  login(req.body ?? {})
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
