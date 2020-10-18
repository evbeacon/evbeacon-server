import jwt from "jsonwebtoken";
import initDB from "../index";
import User from "../models/User";
import type { SafeUserType, UserJWTType, UserType } from "../../types/user";

export const generateJWT = (user: UserType): string =>
  jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "28d",
    }
  );

export const verifyToken = async (token: string): Promise<UserJWTType> => {
  if (token == null || token.length === 0) {
    throw new Error("User is not signed in!");
  }

  return jwt.verify(token, process.env.JWT_SECRET as string) as UserJWTType;
};

export const verifyTokenSecure = async (
  token: string
): Promise<SafeUserType> => {
  if (token == null || token.length === 0) {
    throw new Error("User is not signed in!");
  }

  const { _id } = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as UserJWTType;

  await initDB();

  const user = (await User.findById(_id).lean()) as UserType;

  if (user == null) {
    throw new Error("User does not exist!");
  }

  const { password, ...safeUser } = user;

  return safeUser;
};
