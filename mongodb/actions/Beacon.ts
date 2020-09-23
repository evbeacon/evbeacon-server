import initDB from "../index";
import Beacon from "../models/Beacon";
import {
  BeaconType,
  NewBeaconType,
  GetBeaconType,
  UpdateBeaconChargerType,
  CancelBeaconType,
} from "../../types/Beacon";

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
