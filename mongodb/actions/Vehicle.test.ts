import mongoose from "mongoose";
import {
  createVehicle,
  getVehicle,
  updateVehicle,
  deleteVehicle,
  banVehicle,
} from "./Vehicle";
import { SafeUserType } from "../../types/User";
import { getUser, signUp } from "./User";
import User from "../models/User";

describe("Vehicle", () => {
  let admin: SafeUserType;
  beforeAll(async () => {
    const token = await signUp({
      email: "vehicle@hello.com",
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

  it("should create a new vehicle", async () => {
    const mockVehicle = {
      year: 2020,
      make: "Tesla",
      model: "3",
      color: "Grey",
      plugType: "Tesla",
      licensePlate: "1a",
    };

    const insertedVehicle = await createVehicle(admin, mockVehicle);

    expect(insertedVehicle).not.toBeNull();
    expect(insertedVehicle.owner.toString()).toEqual(admin._id.toString());
    expect(insertedVehicle.plugType).toEqual(mockVehicle.plugType);
  });

  it("should fail createVehicle on null value", async () => {
    try {
      await createVehicle(admin, { plugType: null } as any);
    } catch (error) {
      expect(error.message).toEqual("All parameters must be provided!");
    }
  });

  it("should get vehicle from vehicleId", async () => {
    const mockVehicle = {
      year: 2020,
      make: "Tesla",
      model: "3",
      color: "Grey",
      plugType: "Tesla",
      licensePlate: "2b",
    };

    const insertedVehicle = await createVehicle(admin, mockVehicle);

    expect(insertedVehicle).not.toBeNull();
    expect(insertedVehicle.owner.toString()).toEqual(admin._id.toString());
    expect(insertedVehicle.plugType).toEqual(mockVehicle.plugType);

    const gotVehicle = await getVehicle(admin, { _id: insertedVehicle._id });
    expect(gotVehicle).toEqual(insertedVehicle);
  });

  it("should fail getVehicle on missing vehicleId", async () => {
    try {
      await getVehicle(admin, { _id: null });
    } catch (error) {
      expect(error.message).toEqual("VehicleID must be provided!");
    }
  });

  it("should fail getVehicle on missing vehicle", async () => {
    try {
      await getVehicle(admin, { _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Vehicle does not exist!");
    }
  });

  it("should update vehicle", async () => {
    const mockVehicle = {
      year: 2020,
      make: "Tesla",
      model: "3",
      color: "Grey",
      plugType: "Tesla",
      licensePlate: "3c",
    };

    const insertedVehicle = await createVehicle(admin, mockVehicle);

    expect(insertedVehicle).not.toBeNull();
    expect(insertedVehicle.owner.toString()).toEqual(admin._id.toString());
    expect(insertedVehicle.plugType).toEqual(mockVehicle.plugType);

    const updateFields = {
      _id: insertedVehicle._id,
      color: "Red",
    };

    const updatedVehicle = await updateVehicle(admin, updateFields);

    expect(updatedVehicle).not.toBeNull();
    expect(updatedVehicle.owner.toString()).toEqual(admin._id.toString());
    expect(updatedVehicle.color).toEqual(updateFields.color);
  });

  it("should fail updateVehicle on missing vehicleId", async () => {
    try {
      await updateVehicle(admin, { _id: null });
    } catch (error) {
      expect(error.message).toEqual("VehicleID must be provided!");
    }
  });

  it("should fail updateVehicle on missing vehicle", async () => {
    try {
      await updateVehicle(admin, { _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Vehicle does not exist!");
    }
  });

  it("should delete vehicle", async () => {
    const mockVehicle = {
      year: 2020,
      make: "Tesla",
      model: "3",
      color: "Grey",
      plugType: "Tesla",
      licensePlate: "4d",
    };

    const insertedVehicle = await createVehicle(admin, mockVehicle);

    expect(insertedVehicle).not.toBeNull();
    expect(insertedVehicle.owner.toString()).toEqual(admin._id.toString());
    expect(insertedVehicle.plugType).toEqual(mockVehicle.plugType);

    const bannedVehicle = await deleteVehicle(admin, {
      _id: insertedVehicle._id,
    });

    expect(bannedVehicle).not.toBeNull();
    expect(bannedVehicle.owner.toString()).toEqual(admin._id.toString());
  });

  it("should fail deleteVehicle on missing vehicleId", async () => {
    try {
      await deleteVehicle(admin, { _id: null });
    } catch (error) {
      expect(error.message).toEqual("VehicleID must be provided!");
    }
  });

  it("should fail banVehicle on missing vehicle", async () => {
    try {
      await deleteVehicle(admin, { _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Vehicle does not exist!");
    }
  });

  it("should ban vehicle", async () => {
    const mockVehicle = {
      year: 2020,
      make: "Tesla",
      model: "3",
      color: "Grey",
      plugType: "Tesla",
      licensePlate: "5e",
    };

    const insertedVehicle = await createVehicle(admin, mockVehicle);

    expect(insertedVehicle).not.toBeNull();
    expect(insertedVehicle.owner.toString()).toEqual(admin._id.toString());
    expect(insertedVehicle.plugType).toEqual(mockVehicle.plugType);

    const bannedVehicle = await banVehicle(admin, { _id: insertedVehicle._id });

    expect(bannedVehicle).not.toBeNull();
    expect(bannedVehicle.owner.toString()).toEqual(admin._id.toString());
    expect(bannedVehicle.banned).toEqual(true);
  });

  it("should fail banVehicle on missing vehicleId", async () => {
    try {
      await banVehicle(admin, { _id: null });
    } catch (error) {
      expect(error.message).toEqual("VehicleID must be provided!");
    }
  });

  it("should fail banVehicle on missing vehicle", async () => {
    try {
      await banVehicle(admin, { _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Vehicle does not exist!");
    }
  });
});
