import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import { cancelBeacon } from "../../mongodb/actions/Beacon";
import { verifyTokenSecure } from "../../mongodb/actions/User";

// @route   PUT api/beacon
// @desc    Cancel Beacon Request
// @access  Private
const handler: NowApiHandler = (req: NowRequest, res: NowResponse) =>
  verifyTokenSecure(req.query.token as string)
    .then((user) =>
      cancelBeacon(user, req.body ?? {}).then(() => res.status(200))
    )
    .catch((error) => res.status(500).send(error.message));

export default handler;
