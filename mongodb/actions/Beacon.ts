import dayjs from "dayjs";
import initDB from "../index";
import Beacon from "../models/Beacon";
import Charger from "../models/Charger";
import Vehicle from "../models/Vehicle";
import {
  BeaconType,
  NewBeaconType,
  GetBeaconType,
  UpdateBeaconChargerType,
  CancelBeaconType,
} from "../../types/Beacon";
import { ChargerType } from "../../types/Charger";
import { VehicleType } from "../../types/Vehicle";

export const createBeacon = async (
  beacon: NewBeaconType
): Promise<BeaconType> => {
  Object.values(beacon).forEach((value) => {
    if (value == null) {
      throw new Error("All parameters must be provided!");
    }
  });

  await initDB();

  const newBeacon = new Beacon(beacon);

  await newBeacon.validate();
  await newBeacon.save();

  return newBeacon.toObject();
};

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

export const getBeacon = async ({
  _id,
}: GetBeaconType): Promise<BeaconType> => {
  if (_id == null) {
    throw new Error("BeaconID must be provided!");
  }

  await initDB();

  const beacon = (await Beacon.findById(_id).lean()) as BeaconType;
  if (beacon == null) {
    throw new Error("Beacon does not exist!");
  }

  return beacon;
};

export const updateBeaconCharger = async ({
  _id,
  charger,
}: UpdateBeaconChargerType): Promise<BeaconType> => {
  if (_id == null) {
    throw new Error("BeaconID must be provided!");
  } else if (charger == null) {
    throw new Error("ChargerID must be provided!");
  }

  await initDB();

  const newBeacon = (await Beacon.findByIdAndUpdate(
    _id,
    {
      $push: {
        allowedChargers: charger,
      },
    },
    {
      new: true,
      lean: true,
    }
  )) as BeaconType;

  if (newBeacon == null) {
    throw new Error("Beacon does not exist!");
  }

  return newBeacon;
};

export const cancelBeacon = async ({
  _id,
}: CancelBeaconType): Promise<BeaconType> => {
  if (_id == null) {
    throw new Error("BeaconID must be provided!");
  }

  await initDB();

  const cancelledBeacon = (await Beacon.findByIdAndUpdate(
    _id,
    {
      $set: {
        cancelled: true,
      },
    },
    {
      new: true,
      lean: true,
    }
  )) as BeaconType;

  if (cancelledBeacon == null) {
    throw new Error("Beacon does not exist!");
  }

  return cancelledBeacon;
};
