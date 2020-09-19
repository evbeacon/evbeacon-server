import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import initDB from "../index";
import User from "../models/User";
import {
  UserType,
  SafeUserType,
  UserJWTType,
  NewUserType,
  LoginUserType,
  UpdateUserType,
} from "../../types/User";

const generateJWT = (user: UserType): string =>
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

export const login = async ({
  email,
  password,
}: LoginUserType): Promise<string> => {
  if (email == null || password == null) {
    throw new Error("All parameters must be provided!");
  }

  await initDB();

  const user = await User.findOne({ email });
  if (user == null) {
    throw new Error("User not found!");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new Error("The password you entered is incorrect!");
  }

  return generateJWT(user);
};

export const signUp = async ({
  email,
  password,
  name,
}: NewUserType): Promise<string> => {
  if (email == null || password == null || name == null) {
    throw new Error("All parameters must be provided!");
  }

  await initDB();

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = new User({
    email,
    password: hashedPassword,
    name,
  });

  await user.validate();
  await user.save();

  return generateJWT(user);
};

export const verifyToken = async (token: string): Promise<UserJWTType> => {
  if (token == null || token.length === 0) {
    throw new Error("User is not signed in!");
  }

  return jwt.verify(token, process.env.JWT_SECRET as string) as UserJWTType;
};

export const verifyTokenSecure = async (token: string): Promise<UserType> => {
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

  return user;
};

export const getUser = async ({
  token,
  userId,
}: {
  token?: string;
  userId?: UserType["_id"];
}): Promise<SafeUserType> => {
  if (token == null && userId == null) {
    throw new Error("Token or UserID must be provided!");
  }

  if (token != null) {
    const user = await verifyTokenSecure(token);

    const { password, ...rest } = user;

    return rest;
  }

  await initDB();

  const user = (await User.findById(userId).lean()) as UserType;
  if (user == null) {
    throw new Error("User does not exist!");
  }

  const { password, ...rest } = user;

  return rest;
};

export const updateUser = async ({
  _id,
  ...updateFields
}: UpdateUserType): Promise<SafeUserType> => {
  if (_id == null) {
    throw new Error("UserID must be provided!");
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

  const { password, ...rest } = newUser;

  return rest;
};
