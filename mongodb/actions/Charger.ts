import { Types } from "mongoose";
import initDB from "../index";
import Charger from "../models/Charger";
import {
  ChargerType,
  NewChargerActionType,
  GetChargerActionType,
  UpdateChargerActionType,
  DeleteChargerActionType,
  BanChargerActionType,
} from "../../types/Charger";
import { SafeUserType } from "../../types/User";

export const createCharger = async (
  user: SafeUserType,
  charger: NewChargerActionType
): Promise<ChargerType> => {
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
  { _id }: GetChargerActionType
): Promise<ChargerType> => {
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
  { _id, ...updateFields }: UpdateChargerActionType
): Promise<ChargerType> => {
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
  { _id }: DeleteChargerActionType
): Promise<ChargerType> => {
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
  { _id, banned = true }: BanChargerActionType
): Promise<ChargerType> => {
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

  return bannedCharger;
};
