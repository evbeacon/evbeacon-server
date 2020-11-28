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

  const currentDate = dayjs().utc();
  const currentJsDate = currentDate.toDate();
  const currentTime = currentDate.hour() * 60 + currentDate.minute();

  const chargers = (await Charger.find({
    location: {
      $near: {
        $maxDistance: beacon.vehicleRange,
        $geometry: beacon.location,
      },
    },
    banned: false,
    plugType: vehicle.plugType,
    $or: [
      { disabledUntil: { $exists: false } },
      { disabledUntil: null },
      { disabledUntil: { $lt: currentJsDate } },
    ],
  }).lean()) as ChargerType[];

  return chargers.filter(
    ({ offHoursStartUTC: start, offHoursEndUTC: end }: ChargerType) => {
      if (start != null && end != null) {
        if (start <= end) {
          return currentTime < start || currentTime >= end;
        } else {
          return currentTime >= end && currentTime < start;
        }
      }

      return true;
    }
  );
};
