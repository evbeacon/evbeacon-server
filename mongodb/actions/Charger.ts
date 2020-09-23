import { Types } from "mongoose";
import initDB from "../index";
import Charger from "../models/Charger";
import {
  ChargerType,
  NewChargerType,
  GetChargerType,
  UpdateChargerType,
  DeleteChargerType,
  BanChargerType,
} from "../../types/Charger";

export const createCharger = async (
  charger: NewChargerType
): Promise<ChargerType> => {
  Object.values(charger).forEach((value) => {
    if (value == null) {
      throw new Error("All parameters must be provided!");
    }
  });

  await initDB();

  const newCharger = new Charger(charger);

  await newCharger.validate();
  await newCharger.save();

  return newCharger.toObject();
};

export const getCharger = async ({
  _id,
}: GetChargerType): Promise<ChargerType> => {
  if (_id == null) {
    throw new Error("ChargerID must be provided!");
  }

  await initDB();

  const charger = (await Charger.findById(_id).lean()) as ChargerType;
  if (charger == null) {
    throw new Error("Charger does not exist!");
  }

  return charger;
};

export const updateCharger = async ({
  _id,
  ...updateFields
}: UpdateChargerType): Promise<ChargerType> => {
  if (_id == null) {
    throw new Error("ChargerID must be provided!");
  }

  await initDB();

  const newCharger = (await Charger.findByIdAndUpdate(
    _id,
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

export const deleteCharger = async ({
  _id,
}: DeleteChargerType): Promise<ChargerType> => {
  if (_id == null) {
    throw new Error("ChargerID must be provided!");
  }

  await initDB();

  const deletedCharger = await Charger.findOneAndDelete({
    _id: Types.ObjectId(_id),
    banned: false,
  });

  if (deletedCharger == null) {
    throw new Error("Charger does not exist!");
  }

  return deletedCharger.toObject();
};

export const banCharger = async ({
  _id,
  banned = true,
}: BanChargerType): Promise<ChargerType> => {
  if (_id == null) {
    throw new Error("ChargerID must be provided!");
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
