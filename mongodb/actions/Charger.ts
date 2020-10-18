import { Types } from "mongoose";
import initDB from "../index";
import Charger from "../models/Charger";
import type { ChargerType } from "../../types/charger";
import type {
  CreateChargerParams,
  GetChargerParams,
  UpdateChargerParams,
  DeleteChargerParams,
  BanChargerParams,
  CreateChargerResponse,
  GetChargerResponse,
  UpdateChargerResponse,
  DeleteChargerResponse,
  BanChargerResponse,
} from "../../types/actions/charger";
import type { SafeUserType } from "../../types/user";

export const createCharger = async (
  user: SafeUserType,
  charger: CreateChargerParams
): Promise<CreateChargerResponse> => {
  Object.values(charger).forEach((value) => {
    if (value == null) {
      throw new Error("All parameters must be provided!");
    }
  });

  await initDB();

  const chargerFields = {
    ...charger,
    owner: user._id,
  };

  const newCharger = new Charger(chargerFields);

  await newCharger.validate();
  await newCharger.save();

  return newCharger.toObject();
};

export const getCharger = async (
  user: SafeUserType,
  { _id }: GetChargerParams
): Promise<GetChargerResponse> => {
  if (_id == null) {
    throw new Error("ChargerID must be provided!");
  }

  await initDB();

  const chargerQuery = {
    _id: Types.ObjectId(_id),
    ...(user.role === "User" && {
      owner: user._id,
    }),
  };

  const charger = (await Charger.findOne(chargerQuery).lean()) as ChargerType;
  if (charger == null) {
    throw new Error("Charger does not exist!");
  }

  return charger;
};

export const updateCharger = async (
  user: SafeUserType,
  { _id, ...updateFields }: UpdateChargerParams
): Promise<UpdateChargerResponse> => {
  if (_id == null) {
    throw new Error("ChargerID must be provided!");
  }

  await initDB();

  const chargerQuery = {
    _id: Types.ObjectId(_id),
    ...(user.role === "User" && {
      owner: user._id,
    }),
  };

  const newCharger = (await Charger.findOneAndUpdate(
    chargerQuery,
    { $set: updateFields },
    {
      new: true,
      lean: true,
    }
  )) as ChargerType;

  if (newCharger == null) {
    throw new Error("Charger does not exist!");
  }

  return newCharger;
};

export const deleteCharger = async (
  user: SafeUserType,
  { _id }: DeleteChargerParams
): Promise<DeleteChargerResponse> => {
  if (_id == null) {
    throw new Error("ChargerID must be provided!");
  }

  await initDB();

  const deletedCharger = await Charger.findOneAndDelete({
    _id: Types.ObjectId(_id),
    banned: false,
    ...(user.role === "User" && {
      owner: user._id,
    }),
  });

  if (deletedCharger == null) {
    throw new Error("Charger does not exist!");
  }

  return deletedCharger.toObject();
};

export const banCharger = async (
  user: SafeUserType,
  { _id, banned = true }: BanChargerParams
): Promise<BanChargerResponse> => {
  if (_id == null) {
    throw new Error("ChargerID must be provided!");
  } else if (user.role !== "Admin") {
    throw new Error("Only admins can ban chargers!");
  }

  await initDB();

  const bannedCharger = (await Charger.findByIdAndUpdate(
    _id,
    {
      $set: {
        banned,
      },
    },
    {
      new: true,
      lean: true,
    }
  )) as ChargerType;

  if (bannedCharger == null) {
    throw new Error("Charger does not exist!");
  }
};
