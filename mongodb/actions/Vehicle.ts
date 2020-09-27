import { Types } from "mongoose";
import initDB from "../index";
import Vehicle from "../models/Vehicle";
import {
  VehicleType,
  NewVehicleActionType,
  GetVehicleActionType,
  UpdateVehicleActionType,
  DeleteVehicleActionType,
  BanVehicleActionType,
} from "../../types/Vehicle";
import { SafeUserType } from "../../types/User";

export const createVehicle = async (
  user: SafeUserType,
  vehicle: NewVehicleActionType
): Promise<VehicleType> => {
  Object.values(vehicle).forEach((value) => {
    if (value == null) {
      throw new Error("All parameters must be provided!");
    }
  });

  await initDB();

  const vehicleFields = {
    ...vehicle,
    owner: user._id,
  };

  const newVehicle = new Vehicle(vehicleFields);

  await newVehicle.validate();
  await newVehicle.save();

  return newVehicle.toObject();
};

export const getVehicle = async (
  user: SafeUserType,
  { _id }: GetVehicleActionType
): Promise<VehicleType> => {
  if (_id == null) {
    throw new Error("VehicleID must be provided!");
  }

  await initDB();

  const vehicleQuery = {
    _id: Types.ObjectId(_id),
    ...(user.role === "User" && {
      owner: user._id,
    }),
  };

  const vehicle = (await Vehicle.findOne(vehicleQuery).lean()) as VehicleType;
  if (vehicle == null) {
    throw new Error("Vehicle does not exist!");
  }

  return vehicle;
};

export const updateVehicle = async (
  user: SafeUserType,
  { _id, ...updateFields }: UpdateVehicleActionType
): Promise<VehicleType> => {
  if (_id == null) {
    throw new Error("VehicleID must be provided!");
  }

  await initDB();

  const vehicleQuery = {
    _id: Types.ObjectId(_id),
    ...(user.role === "User" && {
      owner: user._id,
    }),
  };

  const newVehicle = (await Vehicle.findOneAndUpdate(
    vehicleQuery,
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

export const deleteVehicle = async (
  user: SafeUserType,
  { _id }: DeleteVehicleActionType
): Promise<VehicleType> => {
  if (_id == null) {
    throw new Error("VehicleID must be provided!");
  }

  await initDB();

  const deletedVehicle = await Vehicle.findOneAndDelete({
    _id: Types.ObjectId(_id),
    banned: false,
    ...(user.role === "User" && {
      owner: user._id,
    }),
  });

  if (deletedVehicle == null) {
    throw new Error("Vehicle does not exist!");
  }

  return deletedVehicle.toObject();
};

export const banVehicle = async (
  user: SafeUserType,
  { _id, banned = true }: BanVehicleActionType
): Promise<VehicleType> => {
  if (_id == null) {
    throw new Error("VehicleID must be provided!");
  } else if (user.role !== "Admin") {
    throw new Error("Only admins can ban vehicles!");
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
