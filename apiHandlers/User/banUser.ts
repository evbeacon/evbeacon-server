import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import { banUser } from "../../mongodb/actions/User";
import { verifyTokenSecure } from "../../mongodb/utils/Auth";

// @route   PUT api/user
// @desc    Ban User
// @access  Private
const handler: NowApiHandler = (req: NowRequest, res: NowResponse) =>
  verifyTokenSecure(req.query.token as string)
    .then((user) =>
      banUser(user, req.body ?? {}).then(() => res.status(200).send("Success"))
    )
    .catch((error) => res.status(500).send(error.message));

export default handler;
