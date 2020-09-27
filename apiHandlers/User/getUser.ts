import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import { getUser } from "../../mongodb/actions/User";

// @route   GET api/user
// @desc    Get User
// @access  Public
const handler: NowApiHandler = (req: NowRequest, res: NowResponse) =>
  getUser(req.query as any)
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
