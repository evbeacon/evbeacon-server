import type { UserType, SafeUserType } from "../user";

export type LoginActionParams = {
  email: UserType["email"];
  password: UserType["password"];
};

export type LoginActionResponse = {
  token: string;
  user: SafeUserType;
};

export type SignUpActionParams = {
  email: UserType["email"];
  password: UserType["password"];
  name: UserType["name"];
};

export type SignUpActionResponse = {
  token: string;
  user: SafeUserType;
};
