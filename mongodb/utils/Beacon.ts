import dayjs from "dayjs";
import Vehicle from "../models/Vehicle";
import Charger from "../models/Charger";
import type { BeaconType } from "../../types/beacon";
import type { ChargerType } from "../../types/charger";
import type { VehicleType } from "../../types/vehicle";

export const getNearbyChargers = async (
  beacon: BeaconType
): Promise<ChargerType[]> => {
  const vehicle = (await Vehicle.findById(
    beacon.vehicle
  ).lean()) as VehicleType;

  const currentDate = new Date();

  const chargers = (await Charger.find({
    banned: false,
    plugType: vehicle.plugType,
    $or: [
      { disabledUntil: { $lt: currentDate } },
      { disabledUntil: { $exists: false } },
      { disabledUntil: null },
    ],
    location: {
      $near: {
        $maxDistance: beacon.vehicleRange,
        $geometry: beacon.location,
      },
    },
  }).lean()) as ChargerType[];

  const currentHour = dayjs().utc().hour();

  const nearbyChargers = chargers.filter(
    ({ offHoursStartUTC: start, offHoursEndUTC: end }: ChargerType) => {
      if (start != null && end != null) {
        if (start <= end) {
          return currentHour < start || currentHour > end;
        } else {
          return currentHour > end && currentHour < start;
        }
      }

      return true;
    }
  );

  if (nearbyChargers.length === 0) {
    throw new Error("No nearby chargers!");
  }

  return nearbyChargers;
};
