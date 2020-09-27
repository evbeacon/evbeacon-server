import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import { updateUser, verifyTokenSecure } from "../../mongodb/actions/User";

// @route   PATCH api/user
// @desc    Update User
// @access  Private
const handler: NowApiHandler = (req: NowRequest, res: NowResponse) =>
  verifyTokenSecure(req.query.token as string)
    .then((user) =>
      updateUser(user, req.body ?? {}).then((payload) =>
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