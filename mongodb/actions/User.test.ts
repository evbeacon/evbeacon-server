import mongoose from "mongoose";
import {
  signUp,
  login,
  getUser,
  verifyToken,
  verifyTokenSecure,
  updateUser,
} from "./User";

describe("User", () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should create a new user on sign-up", async () => {
    const mockUser = {
      email: "example@example.com",
      password: "Test123",
      name: "Test User",
    };

    const token = await signUp(mockUser);

    const insertedUser = await getUser({ token });

    expect(insertedUser).not.toBeNull();
    expect(insertedUser.email).toEqual(mockUser.email);
    expect(insertedUser.name).toEqual(mockUser.name);
  });

  it("should have matching jwt info", async () => {
    const mockUser = {
      email: "jwt@example.com",
      password: "Test123",
      name: "Jwt User",
    };

    const token = await signUp(mockUser);

    const insertedUser = await getUser({ token });

    expect(insertedUser).not.toBeNull();
    expect(insertedUser.email).toEqual(mockUser.email);
    expect(insertedUser.name).toEqual(mockUser.name);

    const jwtUser = await verifyToken(token);

    expect(jwtUser).not.toBeNull();
    expect(jwtUser.email).toEqual(mockUser.email);
    expect(jwtUser.role).toEqual(insertedUser.role);
    expect(jwtUser._id).toEqual(insertedUser._id.toString());
  });

  it("should match jwt between sign-up and login", async () => {
    const mockUser = {
      email: "match@example.com",
      password: "Test123",
      name: "Jwt User",
    };

    const signUpToken = await signUp(mockUser);
    const insertedUser = await getUser({ token: signUpToken });

    expect(insertedUser).not.toBeNull();
    expect(insertedUser.email).toEqual(mockUser.email);
    expect(insertedUser.name).toEqual(mockUser.name);

    const loginToken = await login(mockUser);
    expect(loginToken).not.toBeNull();
    expect(loginToken).toEqual(signUpToken);
  });

  it("should retrieve full user from jwt", async () => {
    const mockUser = {
      email: "jwtFull@example.com",
      password: "Test123",
      name: "Jwt Full User",
    };

    const token = await signUp(mockUser);

    const insertedUser = await getUser({ token });

    expect(insertedUser).not.toBeNull();
    expect(insertedUser.email).toEqual(mockUser.email);
    expect(insertedUser.name).toEqual(mockUser.name);

    const fullJwtUser = await verifyTokenSecure(token);

    expect(insertedUser).toEqual(fullJwtUser);
  });

  it("should find and update user", async () => {
    const mockUser = {
      email: "update@example.com",
      password: "Test123",
      name: "Update User",
    };

    const token = await signUp(mockUser);
    const insertedUser = await getUser({ token });

    const newFields = {
      name: "New Name",
    };

    const updatedUser = await updateUser({
      _id: insertedUser._id,
      ...newFields,
    });

    expect(insertedUser).not.toEqual(updatedUser);
    expect(updatedUser.name).toEqual(newFields.name);
  });
});
