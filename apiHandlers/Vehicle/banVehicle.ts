import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import { banVehicle } from "../../mongodb/actions/Vehicle";
import { verifyTokenSecure } from "../../mongodb/utils/Auth";

// @route   PUT api/vehicle
// @desc    Ban Vehicle
// @access  Private
const handler: NowApiHandler = (req: NowRequest, res: NowResponse) =>
  verifyTokenSecure(req.query.token as string)
    .then((user) =>
      banVehicle(user, req.body ?? {}).then(() => res.status(200))
    )
    .catch((error) => res.status(500).send(error.message));

export default handler;
