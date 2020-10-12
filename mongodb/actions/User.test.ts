import mongoose from "mongoose";
import {
  signUp,
  login,
  getUser,
  updateUser,
  banUser,
  verifyToken,
  verifyTokenSecure,
  generateJWT,
} from "./User";
import { SafeUserType } from "../../types/User";
import User from "../models/User";

describe("User", () => {
  let admin: SafeUserType;
  beforeAll(async () => {
    const { token } = await signUp({
      email: "user@hello.com",
      password: "somePass",
      name: "My Name",
    });

    admin = await getUser({ token });

    admin = await User.findByIdAndUpdate(
      admin._id,
      {
        $set: {
          role: "Admin",
        },
      },
      {
        new: true,
      }
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should create a new user on sign-up", async () => {
    const mockUser = {
      email: "example@example.com",
      password: "Test123",
      name: "Test User",
    };

    const { token } = await signUp(mockUser);

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

    const { token } = await signUp(mockUser);
    const decodedUser = await verifyToken(token);

    const gotUser = await getUser({ _id: decodedUser._id });

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

    const { token } = await signUp(mockUser);

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

    const { token: signUpToken } = await signUp(mockUser);
    const insertedUser = await getUser({ token: signUpToken });

    expect(insertedUser).not.toBeNull();
    expect(insertedUser.email).toEqual(mockUser.email);
    expect(insertedUser.name).toEqual(mockUser.name);

    const { token: loginToken } = await login(mockUser);
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

    const { token } = await signUp(mockUser);

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

    const { token } = await signUp(mockUser);
    const insertedUser = await getUser({ token });

    const newFields = {
      name: "New Name",
    };

    const updatedUser = await updateUser(insertedUser, {
      _id: insertedUser._id,
      ...newFields,
    });

    expect(insertedUser).not.toEqual(updatedUser);
    expect(updatedUser.name).toEqual(newFields.name);
  });

  it("should fail update user on other users account", async () => {
    const mockUser = {
      email: "otheruser@example.com",
      password: "Test123",
      name: "Update User",
    };

    const { token } = await signUp(mockUser);
    const insertedUser = await getUser({ token });

    const newFields = {
      name: "New Name",
    };

    try {
      await updateUser(insertedUser, {
        _id: admin._id,
        ...newFields,
      });
    } catch (error) {
      expect(error.message).toEqual(
        "Only the user can edit their own profile!"
      );
    }
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
      await getUser({ _id: null });
    } catch (error) {
      expect(error.message).toEqual("Token or UserID must be provided!");
    }
  });

  it("should fail getUser on missing user", async () => {
    try {
      await getUser({ _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("User does not exist!");
    }
  });

  it("should ban user", async () => {
    const mockUser = {
      email: "ban@example.com",
      password: "Test123",
      name: "Update User",
    };

    const { token } = await signUp(mockUser);
    const insertedUser = await getUser({ token });

    const bannedUser = await banUser(admin, { _id: insertedUser._id });

    expect(bannedUser).not.toBeNull();
    expect(bannedUser._id.toString()).toEqual(insertedUser._id.toString());
    expect(bannedUser.banned).toEqual(true);
  });

  it("should fail ban user from nonadmin", async () => {
    const mockUser = {
      email: "regular@example.com",
      password: "Test123",
      name: "Update User",
    };

    const { token } = await signUp(mockUser);
    const insertedUser = await getUser({ token });

    try {
      await banUser(insertedUser, { _id: insertedUser._id });
    } catch (error) {
      expect(error.message).toEqual("Only admins can ban users!");
    }
  });

  it("should fail banUser on missing userId", async () => {
    try {
      await banUser(admin, { _id: null });
    } catch (error) {
      expect(error.message).toEqual("UserID must be provided!");
    }
  });

  it("should fail banUser on missing user", async () => {
    try {
      await banUser(admin, { _id: "5f68a882170de39b76935ee5" });
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
      await updateUser(admin, { _id: null });
    } catch (error) {
      expect(error.message).toEqual("UserID must be provided!");
    }
  });

  it("should fail updateUser on missing user", async () => {
    try {
      await updateUser(admin, { _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("User does not exist!");
    }
  });
});
