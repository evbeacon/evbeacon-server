import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import { banCharger } from "../../mongodb/actions/Charger";
import { verifyTokenSecure } from "../../mongodb/actions/User";

// @route   PUT api/charger
// @desc    Ban Charger
// @access  Private
const handler: NowApiHandler = (req: NowRequest, res: NowResponse) =>
  verifyTokenSecure(req.query.token as string)
    .then((user) =>
      banCharger(user, req.body ?? {}).then(() => res.status(200))
    )
    .catch((error) => res.status(500).send(error.message));

export default handler;
