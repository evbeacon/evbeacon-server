import mongoose from "mongoose";
import {
  createCharger,
  getCharger,
  updateCharger,
  banCharger,
} from "./Charger";

const mockCharger = {
  owner: "5f68a882170de39b76935ee5",
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

describe("Charger", () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should create a new charger", async () => {
    const insertedCharger = await createCharger(mockCharger);

    expect(insertedCharger).not.toBeNull();
    expect(insertedCharger.owner.toString()).toEqual(mockCharger.owner);
    expect(insertedCharger.plugType).toEqual(mockCharger.plugType);
  });

  it("should fail createCharger on null value", async () => {
    try {
      await createCharger({ owner: null } as any);
    } catch (error) {
      expect(error.message).toEqual("All parameters must be provided!");
    }
  });

  it("should get charger from chargerId", async () => {
    const insertedCharger = await createCharger(mockCharger);

    expect(insertedCharger).not.toBeNull();
    expect(insertedCharger.owner.toString()).toEqual(mockCharger.owner);
    expect(insertedCharger.plugType).toEqual(mockCharger.plugType);

    const gotCharger = await getCharger({ _id: insertedCharger._id });
    expect(gotCharger).toEqual(insertedCharger);
  });

  it("should fail getCharger on missing chargerId", async () => {
    try {
      await getCharger({ _id: null });
    } catch (error) {
      expect(error.message).toEqual("ChargerID must be provided!");
    }
  });

  it("should fail getCharger on missing charger", async () => {
    try {
      await getCharger({ _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Charger does not exist!");
    }
  });

  it("should update charger", async () => {
    const insertedCharger = await createCharger(mockCharger);

    expect(insertedCharger).not.toBeNull();
    expect(insertedCharger.owner.toString()).toEqual(mockCharger.owner);
    expect(insertedCharger.plugType).toEqual(mockCharger.plugType);

    const updateFields = {
      _id: insertedCharger._id,
      description: "Hello world",
    };

    const updatedCharger = await updateCharger(updateFields);

    expect(updatedCharger).not.toBeNull();
    expect(updatedCharger.owner.toString()).toEqual(mockCharger.owner);
    expect(updatedCharger.description).toEqual(updateFields.description);
  });

  it("should fail updateCharger on missing chargerId", async () => {
    try {
      await updateCharger({ _id: null });
    } catch (error) {
      expect(error.message).toEqual("ChargerID must be provided!");
    }
  });

  it("should fail updateCharger on missing charger", async () => {
    try {
      await updateCharger({ _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Charger does not exist!");
    }
  });

  it("should ban charger", async () => {
    const insertedCharger = await createCharger(mockCharger);

    expect(insertedCharger).not.toBeNull();
    expect(insertedCharger.owner.toString()).toEqual(mockCharger.owner);
    expect(insertedCharger.plugType).toEqual(mockCharger.plugType);

    const bannedCharger = await banCharger({ _id: insertedCharger._id });

    expect(bannedCharger).not.toBeNull();
    expect(bannedCharger.owner.toString()).toEqual(mockCharger.owner);
    expect(bannedCharger.banned).toEqual(true);
  });

  it("should fail banCharger on missing chargerId", async () => {
    try {
      await banCharger({ _id: null });
    } catch (error) {
      expect(error.message).toEqual("ChargerID must be provided!");
    }
  });

  it("should fail banCharger on missing charger", async () => {
    try {
      await banCharger({ _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Charger does not exist!");
    }
  });
});
