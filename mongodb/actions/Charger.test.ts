import mongoose from "mongoose";
import {
  createCharger,
  getCharger,
  updateCharger,
  deleteCharger,
  banCharger,
} from "./Charger";
import { SafeUserType } from "../../types/User";
import { NewChargerActionType } from "../../types/Charger";
import { getUser, signUp } from "./User";
import User from "../models/User";

describe("Charger", () => {
  let admin: SafeUserType;
  let mockCharger: NewChargerActionType;
  beforeAll(async () => {
    const token = await signUp({
      email: "charger@hello.com",
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

    mockCharger = {
      location: {
        coordinates: [1, 2],
      },
      address: {
        street: "1 Main St",
        city: "New York",
        state: "New York",
        country: "United States of America",
      },
      plugType: "Tesla",
    };
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should create a new charger", async () => {
    const insertedCharger = await createCharger(admin, mockCharger);

    expect(insertedCharger).not.toBeNull();
    expect(insertedCharger.owner.toString()).toEqual(admin._id.toString());
    expect(insertedCharger.plugType).toEqual(mockCharger.plugType);
  });

  it("should fail createCharger on null value", async () => {
    try {
      await createCharger(admin, { plugType: null } as any);
    } catch (error) {
      expect(error.message).toEqual("All parameters must be provided!");
    }
  });

  it("should get charger from chargerId", async () => {
    const insertedCharger = await createCharger(admin, mockCharger);

    expect(insertedCharger).not.toBeNull();
    expect(insertedCharger.owner.toString()).toEqual(admin._id.toString());
    expect(insertedCharger.plugType).toEqual(mockCharger.plugType);

    const gotCharger = await getCharger(admin, { _id: insertedCharger._id });
    expect(gotCharger).toEqual(insertedCharger);
  });

  it("should fail getCharger on missing chargerId", async () => {
    try {
      await getCharger(admin, { _id: null });
    } catch (error) {
      expect(error.message).toEqual("ChargerID must be provided!");
    }
  });

  it("should fail getCharger on missing charger", async () => {
    try {
      await getCharger(admin, { _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Charger does not exist!");
    }
  });

  it("should update charger", async () => {
    const insertedCharger = await createCharger(admin, mockCharger);

    expect(insertedCharger).not.toBeNull();
    expect(insertedCharger.owner.toString()).toEqual(admin._id.toString());
    expect(insertedCharger.plugType).toEqual(mockCharger.plugType);

    const updateFields = {
      _id: insertedCharger._id,
      description: "Hello world",
    };

    const updatedCharger = await updateCharger(admin, updateFields);

    expect(updatedCharger).not.toBeNull();
    expect(updatedCharger.owner.toString()).toEqual(admin._id.toString());
    expect(updatedCharger.description).toEqual(updateFields.description);
  });

  it("should fail updateCharger on missing chargerId", async () => {
    try {
      await updateCharger(admin, { _id: null });
    } catch (error) {
      expect(error.message).toEqual("ChargerID must be provided!");
    }
  });

  it("should fail updateCharger on missing charger", async () => {
    try {
      await updateCharger(admin, { _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Charger does not exist!");
    }
  });

  it("should delete charger", async () => {
    const insertedCharger = await createCharger(admin, mockCharger);

    expect(insertedCharger).not.toBeNull();
    expect(insertedCharger.owner.toString()).toEqual(admin._id.toString());
    expect(insertedCharger.plugType).toEqual(mockCharger.plugType);

    const bannedCharger = await deleteCharger(admin, {
      _id: insertedCharger._id,
    });

    expect(bannedCharger).not.toBeNull();
    expect(bannedCharger.owner.toString()).toEqual(admin._id.toString());
  });

  it("should fail deleteCharger on missing chargerId", async () => {
    try {
      await deleteCharger(admin, { _id: null });
    } catch (error) {
      expect(error.message).toEqual("ChargerID must be provided!");
    }
  });

  it("should fail banCharger on missing charger", async () => {
    try {
      await deleteCharger(admin, { _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Charger does not exist!");
    }
  });

  it("should ban charger", async () => {
    const insertedCharger = await createCharger(admin, mockCharger);

    expect(insertedCharger).not.toBeNull();
    expect(insertedCharger.owner.toString()).toEqual(admin._id.toString());
    expect(insertedCharger.plugType).toEqual(mockCharger.plugType);

    const bannedCharger = await banCharger(admin, { _id: insertedCharger._id });

    expect(bannedCharger).not.toBeNull();
    expect(bannedCharger.owner.toString()).toEqual(admin._id.toString());
    expect(bannedCharger.banned).toEqual(true);
  });

  it("should fail banCharger on missing chargerId", async () => {
    try {
      await banCharger(admin, { _id: null });
    } catch (error) {
      expect(error.message).toEqual("ChargerID must be provided!");
    }
  });

  it("should fail banCharger on missing charger", async () => {
    try {
      await banCharger(admin, { _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Charger does not exist!");
    }
  });
});
