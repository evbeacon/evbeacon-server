import mongoose from "mongoose";
import User from "../models/User";
import { getUser, updateUser, banUser } from "./User";
import { signUp } from "./Auth";
import type { SafeUserType } from "../../types/user";

describe("User", () => {
  let admin: SafeUserType;
  beforeAll(async () => {
    const { user } = await signUp({
      email: "user@hello.com",
      password: "somePass",
      name: "My Name",
    });

    admin = await User.findByIdAndUpdate(
      user._id,
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

  it("should get user from userId", async () => {
    const gotUser = await getUser(admin, { _id: admin._id });

    expect(gotUser).not.toBeNull();
    expect(gotUser.email).toEqual(admin.email);
    expect(gotUser.name).toEqual(admin.name);
  });

  it("should find and update user", async () => {
    const mockUser = {
      email: "update@example.com",
      password: "Test123",
      name: "Update User",
    };

    const { user } = await signUp(mockUser);

    const newFields = {
      name: "New Name",
    };

    const updatedUser = await updateUser(user, {
      _id: user._id,
      ...newFields,
    });

    expect(user).not.toEqual(updatedUser);
    expect(updatedUser.name).toEqual(newFields.name);
  });

  it("should fail update user on other users account", async () => {
    const mockUser = {
      email: "otheruser@example.com",
      password: "Test123",
      name: "Update User",
    };

    const { user } = await signUp(mockUser);

    const newFields = {
      name: "New Name",
    };

    try {
      await updateUser(user, {
        _id: admin._id,
        ...newFields,
      });
    } catch (error) {
      expect(error.message).toEqual(
        "Only the user can edit their own profile!"
      );
    }
  });

  it("should fail getUser on missing userId", async () => {
    try {
      await getUser(admin, { _id: null as any });
    } catch (error) {
      expect(error.message).toEqual("Token or UserID must be provided!");
    }
  });

  it("should fail getUser on missing user", async () => {
    try {
      await getUser(admin, { _id: "5f68a882170de39b76935ee5" });
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

    const { user } = await signUp(mockUser);

    await banUser(admin, { _id: user._id });
  });

  it("should fail ban user from nonadmin", async () => {
    const mockUser = {
      email: "regular@example.com",
      password: "Test123",
      name: "Update User",
    };

    const { user } = await signUp(mockUser);

    try {
      await banUser(user, { _id: user._id });
    } catch (error) {
      expect(error.message).toEqual("Only admins can ban users!");
    }
  });

  it("should fail banUser on missing userId", async () => {
    try {
      await banUser(admin, { _id: null as any });
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

  it("should fail updateUser on missing userId", async () => {
    try {
      await updateUser(admin, { _id: null as any });
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
