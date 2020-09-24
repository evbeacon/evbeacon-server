import mongoose from "mongoose";
import {
  createBeacon,
  getNearbyChargers,
  getBeacon,
  updateBeaconCharger,
  cancelBeacon,
} from "./Beacon";
import { createCharger } from "./Charger";
import { createVehicle } from "./Vehicle";

const mockBeacon = {
  owner: "5f68a882170de39b76935ee5",
  vehicle: "5f68a882170de39b76935ee5",
  vehicleRange: 50,
  location: {
    coordinates: [1, 2],
  },
};

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

const mockVehicle = {
  owner: "5f68a882170de39b76935ee5",
  year: 2020,
  make: "Tesla",
  model: "3",
  color: "Grey",
  plugType: "Tesla",
  licensePlate: "1a2b3c",
};

describe("Beacon", () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should create a new beacon", async () => {
    const insertedBeacon = await createBeacon(mockBeacon);

    expect(insertedBeacon).not.toBeNull();
    expect(insertedBeacon.owner.toString()).toEqual(mockBeacon.owner);
    expect(insertedBeacon.vehicleRange).toEqual(mockBeacon.vehicleRange);
  });

  it("should fail createBeacon on null value", async () => {
    try {
      await createBeacon({ owner: null } as any);
    } catch (error) {
      expect(error.message).toEqual("All parameters must be provided!");
    }
  });

  it("should get beacon from beaconId", async () => {
    const insertedBeacon = await createBeacon(mockBeacon);

    expect(insertedBeacon).not.toBeNull();
    expect(insertedBeacon.owner.toString()).toEqual(mockBeacon.owner);
    expect(insertedBeacon.vehicleRange).toEqual(mockBeacon.vehicleRange);

    const gotBeacon = await getBeacon({ _id: insertedBeacon._id });
    expect(gotBeacon).toEqual(insertedBeacon);
  });

  it("should fail getBeacon on missing beaconId", async () => {
    try {
      await getBeacon({ _id: null });
    } catch (error) {
      expect(error.message).toEqual("BeaconID must be provided!");
    }
  });

  it("should fail getBeacon on missing beacon", async () => {
    try {
      await getBeacon({ _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Beacon does not exist!");
    }
  });

  it("should get nearby chargers", async () => {
    const insertedBeacon = await createBeacon(mockBeacon);

    expect(insertedBeacon).not.toBeNull();
    expect(insertedBeacon.owner.toString()).toEqual(mockBeacon.owner);
    expect(insertedBeacon.vehicleRange).toEqual(mockBeacon.vehicleRange);

    const insertedVehicle = await createVehicle(mockVehicle);

    expect(insertedVehicle).not.toBeNull();
    expect(insertedVehicle.owner.toString()).toEqual(mockVehicle.owner);
    expect(insertedVehicle.plugType).toEqual(mockVehicle.plugType);

    const nearbyChargers = await getNearbyChargers(
      insertedBeacon,
      insertedVehicle
    );
    console.log("nearbyChargers", nearbyChargers);

    expect(nearbyChargers).not.toBeNull();
  });

  it("should update beacon", async () => {
    const insertedBeacon = await createBeacon(mockBeacon);

    expect(insertedBeacon).not.toBeNull();
    expect(insertedBeacon.owner.toString()).toEqual(mockBeacon.owner);
    expect(insertedBeacon.vehicleRange).toEqual(mockBeacon.vehicleRange);

    const updateFields = {
      _id: insertedBeacon._id,
      charger: "5f68a882170de39b76935ee5",
    };

    const updatedBeacon = await updateBeaconCharger(updateFields);

    expect(updatedBeacon).not.toBeNull();
    expect(updatedBeacon.owner.toString()).toEqual(mockBeacon.owner);
    expect(updatedBeacon.allowedChargers[0].toString()).toEqual(
      updateFields.charger
    );
  });

  it("should fail updateBeaconCharger on missing beaconId", async () => {
    try {
      const insertedCharger = await createCharger(mockCharger);

      await updateBeaconCharger({
        _id: null,
        charger: insertedCharger._id,
      } as any);
    } catch (error) {
      expect(error.message).toEqual("BeaconID must be provided!");
    }
  });

  it("should fail updateBeaconCharger on missing beacon", async () => {
    try {
      const insertedCharger = await createCharger(mockCharger);

      await updateBeaconCharger({
        _id: "5f68a882170de39b76935ee5",
        charger: insertedCharger._id,
      } as any);
    } catch (error) {
      expect(error.message).toEqual("Beacon does not exist!");
    }
  });

  it("should fail updateBeaconCharger on missing chargerId", async () => {
    try {
      const insertedBeacon = await createBeacon(mockBeacon);

      await updateBeaconCharger({
        _id: insertedBeacon._id,
        charger: null,
      });
    } catch (error) {
      expect(error.message).toEqual("ChargerID must be provided!");
    }
  });

  it("should fail updateBeaconCharger on missing charger", async () => {
    try {
      const insertedBeacon = await createBeacon(mockBeacon);

      await updateBeaconCharger({
        _id: insertedBeacon._id,
        charger: "5f68a882170de39b76935ee5",
      });
    } catch (error) {
      expect(error.message).toEqual("Charger does not exist!");
    }
  });

  it("should cancel beacon", async () => {
    const insertedBeacon = await createBeacon(mockBeacon);

    expect(insertedBeacon).not.toBeNull();
    expect(insertedBeacon.owner.toString()).toEqual(mockBeacon.owner);
    expect(insertedBeacon.vehicleRange).toEqual(mockBeacon.vehicleRange);

    const canceledBeacon = await cancelBeacon({ _id: insertedBeacon._id });

    expect(canceledBeacon).not.toBeNull();
    expect(canceledBeacon.owner.toString()).toEqual(mockBeacon.owner);
    expect(canceledBeacon.cancelled).toEqual(true);
  });

  it("should fail cancelBeacon on missing beaconId", async () => {
    try {
      await cancelBeacon({ _id: null });
    } catch (error) {
      expect(error.message).toEqual("BeaconID must be provided!");
    }
  });

  it("should fail cancelBeacon on missing beacon", async () => {
    try {
      await cancelBeacon({ _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Beacon does not exist!");
    }
  });
});
