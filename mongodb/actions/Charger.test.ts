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

  it("should get charger from chargerId", async () => {
    const insertedCharger = await createCharger(mockCharger);

    expect(insertedCharger).not.toBeNull();
    expect(insertedCharger.owner.toString()).toEqual(mockCharger.owner);
    expect(insertedCharger.plugType).toEqual(mockCharger.plugType);

    const gotCharger = await getCharger({ _id: insertedCharger._id });
    expect(gotCharger).toEqual(insertedCharger);
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
});
