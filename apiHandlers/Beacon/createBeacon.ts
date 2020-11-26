import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import { createBeacon } from "../../mongodb/actions/Beacon";
import { verifyTokenSecure } from "../../mongodb/utils/Auth";
import { getNearbyChargers } from "../../mongodb/utils/Beacon";
import { sendNotification } from "../../utils/notifications";

// @route   POST api/beacon
// @desc    Create Beacon
// @access  Private
const handler: NowApiHandler = (req: NowRequest, res: NowResponse) =>
  verifyTokenSecure(req.query.token as string)
    .then((user) =>
      createBeacon(user, req.body ?? {}).then(async (payload) => {
        const nearbyChargers = await getNearbyChargers(payload);

        if (nearbyChargers.length === 0) {
          throw new Error("No nearby chargers!");
        }

        await sendNotification({
          recepients: nearbyChargers.map((charger) => ({
            userId: charger.owner,
          })),
          message: {
            sound: "default",
            body: "Request to use charger!",
            data: {
              beaconId: payload._id.toString(),
            },
          },
        });

        return res.status(200).json({
          success: true,
          payload,
        });
      })
    )
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: error.message,
      })
    );

export default handler;
