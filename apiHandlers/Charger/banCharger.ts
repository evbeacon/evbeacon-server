import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import { banCharger } from "../../mongodb/actions/Charger";
import { verifyTokenSecure } from "../../mongodb/actions/User";

const handler: NowApiHandler = (req: NowRequest, res: NowResponse) =>
  verifyTokenSecure(req.query.token as string)
    .then((user) =>
      banCharger(user, req.body).then((payload) =>
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
