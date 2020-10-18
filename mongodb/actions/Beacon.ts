import { Types } from "mongoose";
import initDB from "../index";
import Beacon from "../models/Beacon";
import type { BeaconType } from "../../types/beacon";
import type {
  CancelBeaconParams,
  CancelBeaconResponse,
  CreateBeaconParams,
  CreateBeaconResponse,
  GetBeaconParams,
  GetBeaconResponse,
  UpdateBeaconParams,
  UpdateBeaconResponse,
} from "../../types/actions/beacon";
import type { SafeUserType } from "../../types/user";

export const createBeacon = async (
  user: SafeUserType,
  beacon: CreateBeaconParams
): Promise<CreateBeaconResponse> => {
  Object.values(beacon).forEach((value) => {
    if (value == null) {
      throw new Error("All parameters must be provided!");
    }
  });

  await initDB();

  const beaconFields = {
    ...beacon,
    owner: user._id,
  };

  const newBeacon = new Beacon(beaconFields);

  await newBeacon.validate();
  await newBeacon.save();

  return newBeacon.toObject();
};

export const getBeacon = async (
  user: SafeUserType,
  { _id }: GetBeaconParams
): Promise<GetBeaconResponse> => {
  if (_id == null) {
    throw new Error("BeaconID must be provided!");
  }

  await initDB();

  const beaconQuery = {
    _id: Types.ObjectId(_id),
    ...(user.role === "User" && {
      owner: user._id,
    }),
  };

  const beacon = (await Beacon.findOne(beaconQuery).lean()) as BeaconType;
  if (beacon == null) {
    throw new Error("Beacon does not exist!");
  }

  return beacon;
};

export const updateBeaconCharger = async (
  user: SafeUserType,
  { _id, charger }: UpdateBeaconParams
): Promise<UpdateBeaconResponse> => {
  if (_id == null) {
    throw new Error("BeaconID must be provided!");
  } else if (charger == null) {
    throw new Error("ChargerID must be provided!");
  }

  await initDB();

  const beaconQuery = {
    _id: Types.ObjectId(_id),
    ...(user.role === "User" && {
      owner: user._id,
    }),
  };

  const newBeacon = (await Beacon.findOneAndUpdate(
    beaconQuery,
    {
      $push: {
        allowedChargers: charger as any,
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

export const cancelBeacon = async (
  user: SafeUserType,
  { _id }: CancelBeaconParams
): Promise<CancelBeaconResponse> => {
  if (_id == null) {
    throw new Error("BeaconID must be provided!");
  }

  await initDB();

  const beaconQuery = {
    _id: Types.ObjectId(_id),
    ...(user.role === "User" && {
      owner: user._id,
    }),
  };

  const cancelledBeacon = (await Beacon.findOneAndUpdate(
    beaconQuery,
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
};
