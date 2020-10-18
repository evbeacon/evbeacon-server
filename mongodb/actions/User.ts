import initDB from "../index";
import User from "../models/User";
import type { UserType, SafeUserType } from "../../types/user";
import type {
  GetUserParams,
  UpdateUserParams,
  BanUserParams,
  GetUserResponse,
  UpdateUserResponse,
  BanUserResponse,
} from "../../types/actions/user";

export const getUser = async (
  user: SafeUserType,
  { _id }: GetUserParams
): Promise<GetUserResponse> => {
  if (_id == null) {
    return user;
  } else {
    await initDB();

    const user = (await User.findById(_id).lean()) as UserType;
    if (user == null) {
      throw new Error("User does not exist!");
    }

    const { password, ...safeUser } = user;

    return safeUser;
  }
};

export const updateUser = async (
  user: SafeUserType,
  { _id, ...updateFields }: UpdateUserParams
): Promise<UpdateUserResponse> => {
  if (_id == null) {
    throw new Error("UserID must be provided!");
  } else if (user.role !== "Admin" && user._id.toString() !== _id.toString()) {
    throw new Error("Only the user can edit their own profile!");
  }

  await initDB();

  const newUser = (await User.findByIdAndUpdate(
    _id,
    { $set: updateFields },
    {
      new: true,
      lean: true,
    }
  )) as UserType;

  if (newUser == null) {
    throw new Error("User does not exist!");
  }

  const { password, ...safeUser } = newUser;

  return safeUser;
};

export const banUser = async (
  user: SafeUserType,
  { _id, banned = true }: BanUserParams
): Promise<BanUserResponse> => {
  if (_id == null) {
    throw new Error("UserID must be provided!");
  } else if (user.role !== "Admin") {
    throw new Error("Only admins can ban users!");
  }

  await initDB();

  const bannedUser = (await User.findByIdAndUpdate(
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
  )) as UserType;

  if (bannedUser == null) {
    throw new Error("User does not exist!");
  }
};
