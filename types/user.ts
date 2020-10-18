export type UserType = {
  _id: string;
  email: string;
  password: string;
  role: "Admin" | "User";
  name: string;
  bio: string;
  finishedCharger: boolean;
  finishedVehicle: boolean;
  banned: boolean;
};

export type SafeUserType = Omit<UserType, "password">;

export type UserJWTType = Pick<UserType, "_id" | "email" | "role">;
