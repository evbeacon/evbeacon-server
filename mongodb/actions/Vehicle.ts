import { Types } from "mongoose";
import initDB from "../index";
import Vehicle from "../models/Vehicle";
import {
  VehicleType,
  NewVehicleType,
  GetVehicleType,
  UpdateVehicleType,
  DeleteVehicleType,
  BanVehicleType,
} from "../../types/Vehicle";

export const createVehicle = async (
  vehicle: NewVehicleType
): Promise<VehicleType> => {
  Object.values(vehicle).forEach((value) => {
    if (value == null) {
      throw new Error("All parameters must be provided!");
    }
  });

  await initDB();

  const newVehicle = new Vehicle(vehicle);

  await newVehicle.validate();
  await newVehicle.save();

  return newVehicle.toObject();
};

export const getVehicle = async ({
  _id,
}: GetVehicleType): Promise<VehicleType> => {
  if (_id == null) {
    throw new Error("VehicleID must be provided!");
  }

  await initDB();

  const vehicle = (await Vehicle.findById(_id).lean()) as VehicleType;
  if (vehicle == null) {
    throw new Error("Vehicle does not exist!");
  }

  return vehicle;
};

export const updateVehicle = async ({
  _id,
  ...updateFields
}: UpdateVehicleType): Promise<VehicleType> => {
  if (_id == null) {
    throw new Error("VehicleID must be provided!");
  }

  await initDB();

  const newVehicle = (await Vehicle.findByIdAndUpdate(
    _id,
    { $set: updateFields },
    {
      new: true,
      lean: true,
    }
  )) as VehicleType;

  if (newVehicle == null) {
    throw new Error("Vehicle does not exist!");
  }

  return newVehicle;
};

export const deleteVehicle = async ({
  _id,
}: DeleteVehicleType): Promise<VehicleType> => {
  if (_id == null) {
    throw new Error("VehicleID must be provided!");
  }

  await initDB();

  const deletedVehicle = await Vehicle.findOneAndDelete({
    _id: Types.ObjectId(_id),
    banned: false,
  });

  if (deletedVehicle == null) {
    throw new Error("Vehicle does not exist!");
  }

  return deletedVehicle.toObject();
};

export const banVehicle = async ({
  _id,
  banned = true,
}: BanVehicleType): Promise<VehicleType> => {
  if (_id == null) {
    throw new Error("VehicleID must be provided!");
  }

  await initDB();

  const bannedVehicle = (await Vehicle.findByIdAndUpdate(
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
  )) as VehicleType;

  if (bannedVehicle == null) {
    throw new Error("Vehicle does not exist!");
  }

  return bannedVehicle;
};
