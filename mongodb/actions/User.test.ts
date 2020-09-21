import mongoose from "mongoose";
import {
  signUp,
  login,
  getUser,
  verifyToken,
  verifyTokenSecure,
  updateUser,
  generateJWT,
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

  it("should get user from userId", async () => {
    const mockUser = {
      email: "fromUserId@example.com",
      password: "Test123",
      name: "Test User",
    };

    const token = await signUp(mockUser);
    const decodedUser = await verifyToken(token);

    const gotUser = await getUser({ userId: decodedUser._id });

    expect(gotUser).not.toBeNull();
    expect(gotUser.email).toEqual(mockUser.email);
    expect(gotUser.name).toEqual(mockUser.name);
  });

  it("should fail sign-up on missing params", async () => {
    const mockUser = {
      email: "example@example.com",
    };

    try {
      await signUp(mockUser as any);
    } catch (error) {
      expect(error.message).toEqual("All parameters must be provided!");
    }
  });

  it("should fail login on missing params", async () => {
    const mockUser = {
      email: "example@example.com",
    };

    try {
      await login(mockUser as any);
    } catch (error) {
      expect(error.message).toEqual("All parameters must be provided!");
    }
  });

  it("should fail login on missing user", async () => {
    const mockUser = {
      email: "missing@example.com",
      password: "Test123",
    };

    try {
      await login(mockUser);
    } catch (error) {
      expect(error.message).toEqual("User not found!");
    }
  });

  it("should fail login on incorrect password", async () => {
    const mockUser = {
      email: "incorrect@example.com",
      name: "Test User",
      password: "Test123",
    };

    const mockLogin = {
      email: mockUser.email,
      password: "WrongPassword123",
    };

    try {
      await signUp(mockUser);

      await login(mockLogin);
    } catch (error) {
      expect(error.message).toEqual("The password you entered is incorrect!");
    }
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

    const decodedSignUp = await verifyToken(signUpToken);
    const decodedLogin = await verifyToken(loginToken);
    expect(decodedLogin._id).toEqual(decodedSignUp._id);
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

  it("should fail getUser on missing token", async () => {
    try {
      await getUser({ token: null } as any);
    } catch (error) {
      expect(error.message).toEqual("Token or UserID must be provided!");
    }
  });

  it("should fail getUser on missing userId", async () => {
    try {
      await getUser({ userId: null });
    } catch (error) {
      expect(error.message).toEqual("Token or UserID must be provided!");
    }
  });

  it("should fail getUser on missing user", async () => {
    try {
      await getUser({ userId: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("User does not exist!");
    }
  });

  it("should fail verifyToken on missing token", async () => {
    try {
      await verifyToken(null as any);
    } catch (error) {
      expect(error.message).toEqual("User is not signed in!");
    }
  });

  it("should fail verifyTokenSecure on missing token", async () => {
    try {
      await verifyTokenSecure(null as any);
    } catch (error) {
      expect(error.message).toEqual("User is not signed in!");
    }
  });

  it("should fail verifyTokenSecure on missing user", async () => {
    try {
      const mockUser = {
        _id: "5f68a882170de39b76935ee5",
      };

      const mockJWT = generateJWT(mockUser as any);

      await verifyTokenSecure(mockJWT);
    } catch (error) {
      expect(error.message).toEqual("User does not exist!");
    }
  });

  it("should fail updateUser on missing userId", async () => {
    try {
      await updateUser({ _id: null });
    } catch (error) {
      expect(error.message).toEqual("UserID must be provided!");
    }
  });

  it("should fail updateUser on missing user", async () => {
    try {
      await updateUser({ _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("User does not exist!");
    }
  });
});
