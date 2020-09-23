import mongoose from "mongoose";
import {
  createVehicle,
  getVehicle,
  updateVehicle,
  deleteVehicle,
  banVehicle,
} from "./Vehicle";

describe("Vehicle", () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should create a new vehicle", async () => {
    const mockVehicle = {
      owner: "5f68a882170de39b76935ee5",
      year: 2020,
      make: "Tesla",
      model: "3",
      color: "Grey",
      plugType: "Tesla",
      licensePlate: "1a",
    };

    const insertedVehicle = await createVehicle(mockVehicle);

    expect(insertedVehicle).not.toBeNull();
    expect(insertedVehicle.owner.toString()).toEqual(mockVehicle.owner);
    expect(insertedVehicle.plugType).toEqual(mockVehicle.plugType);
  });

  it("should fail createVehicle on null value", async () => {
    try {
      await createVehicle({ owner: null } as any);
    } catch (error) {
      expect(error.message).toEqual("All parameters must be provided!");
    }
  });

  it("should get vehicle from vehicleId", async () => {
    const mockVehicle = {
      owner: "5f68a882170de39b76935ee5",
      year: 2020,
      make: "Tesla",
      model: "3",
      color: "Grey",
      plugType: "Tesla",
      licensePlate: "2b",
    };

    const insertedVehicle = await createVehicle(mockVehicle);

    expect(insertedVehicle).not.toBeNull();
    expect(insertedVehicle.owner.toString()).toEqual(mockVehicle.owner);
    expect(insertedVehicle.plugType).toEqual(mockVehicle.plugType);

    const gotVehicle = await getVehicle({ _id: insertedVehicle._id });
    expect(gotVehicle).toEqual(insertedVehicle);
  });

  it("should fail getVehicle on missing vehicleId", async () => {
    try {
      await getVehicle({ _id: null });
    } catch (error) {
      expect(error.message).toEqual("VehicleID must be provided!");
    }
  });

  it("should fail getVehicle on missing vehicle", async () => {
    try {
      await getVehicle({ _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Vehicle does not exist!");
    }
  });

  it("should update vehicle", async () => {
    const mockVehicle = {
      owner: "5f68a882170de39b76935ee5",
      year: 2020,
      make: "Tesla",
      model: "3",
      color: "Grey",
      plugType: "Tesla",
      licensePlate: "3c",
    };

    const insertedVehicle = await createVehicle(mockVehicle);

    expect(insertedVehicle).not.toBeNull();
    expect(insertedVehicle.owner.toString()).toEqual(mockVehicle.owner);
    expect(insertedVehicle.plugType).toEqual(mockVehicle.plugType);

    const updateFields = {
      _id: insertedVehicle._id,
      color: "Red",
    };

    const updatedVehicle = await updateVehicle(updateFields);

    expect(updatedVehicle).not.toBeNull();
    expect(updatedVehicle.owner.toString()).toEqual(mockVehicle.owner);
    expect(updatedVehicle.color).toEqual(updateFields.color);
  });

  it("should fail updateVehicle on missing vehicleId", async () => {
    try {
      await updateVehicle({ _id: null });
    } catch (error) {
      expect(error.message).toEqual("VehicleID must be provided!");
    }
  });

  it("should fail updateVehicle on missing vehicle", async () => {
    try {
      await updateVehicle({ _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Vehicle does not exist!");
    }
  });

  it("should delete vehicle", async () => {
    const mockVehicle = {
      owner: "5f68a882170de39b76935ee5",
      year: 2020,
      make: "Tesla",
      model: "3",
      color: "Grey",
      plugType: "Tesla",
      licensePlate: "4d",
    };

    const insertedVehicle = await createVehicle(mockVehicle);

    expect(insertedVehicle).not.toBeNull();
    expect(insertedVehicle.owner.toString()).toEqual(mockVehicle.owner);
    expect(insertedVehicle.plugType).toEqual(mockVehicle.plugType);

    const bannedVehicle = await deleteVehicle({ _id: insertedVehicle._id });

    expect(bannedVehicle).not.toBeNull();
    expect(bannedVehicle.owner.toString()).toEqual(mockVehicle.owner);
  });

  it("should fail deleteVehicle on missing vehicleId", async () => {
    try {
      await deleteVehicle({ _id: null });
    } catch (error) {
      expect(error.message).toEqual("VehicleID must be provided!");
    }
  });

  it("should fail banVehicle on missing vehicle", async () => {
    try {
      await deleteVehicle({ _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Vehicle does not exist!");
    }
  });

  it("should ban vehicle", async () => {
    const mockVehicle = {
      owner: "5f68a882170de39b76935ee5",
      year: 2020,
      make: "Tesla",
      model: "3",
      color: "Grey",
      plugType: "Tesla",
      licensePlate: "5e",
    };

    const insertedVehicle = await createVehicle(mockVehicle);

    expect(insertedVehicle).not.toBeNull();
    expect(insertedVehicle.owner.toString()).toEqual(mockVehicle.owner);
    expect(insertedVehicle.plugType).toEqual(mockVehicle.plugType);

    const bannedVehicle = await banVehicle({ _id: insertedVehicle._id });

    expect(bannedVehicle).not.toBeNull();
    expect(bannedVehicle.owner.toString()).toEqual(mockVehicle.owner);
    expect(bannedVehicle.banned).toEqual(true);
  });

  it("should fail banVehicle on missing vehicleId", async () => {
    try {
      await banVehicle({ _id: null });
    } catch (error) {
      expect(error.message).toEqual("VehicleID must be provided!");
    }
  });

  it("should fail banVehicle on missing vehicle", async () => {
    try {
      await banVehicle({ _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Vehicle does not exist!");
    }
  });
});
