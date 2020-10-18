import bcrypt from "bcrypt";
import initDB from "../index";
import User from "../models/User";
import { generateJWT } from "../utils/Auth";
import type { UserType } from "../../types/user";
import type {
  LoginActionParams,
  LoginActionResponse,
  SignUpActionParams,
  SignUpActionResponse,
} from "../../types/actions/auth";

export const login = async ({
  email,
  password,
}: LoginActionParams): Promise<LoginActionResponse> => {
  if (email == null || password == null) {
    throw new Error("All parameters must be provided!");
  }

  await initDB();

  const user = (await User.findOne({ email }).lean()) as UserType;
  if (user == null) {
    throw new Error("User not found!");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new Error("The password you entered is incorrect!");
  }

  const { password: _, ...safeUser } = user;
  const token = generateJWT(user);

  return {
    token,
    user: safeUser,
  };
};

export const signUp = async ({
  email,
  password,
  name,
}: SignUpActionParams): Promise<SignUpActionResponse> => {
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

  const { password: _, ...safeUser } = user.toObject();
  const token = generateJWT(user);

  return {
    token,
    user: safeUser,
  };
};
