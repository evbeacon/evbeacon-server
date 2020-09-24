import mongoose from "mongoose";
import dayjs from "dayjs";
import {
  createBeacon,
  getNearbyChargers,
  getBeacon,
  updateBeaconCharger,
  cancelBeacon,
} from "./Beacon";
import { signUp, getUser } from "./User";
import { createCharger } from "./Charger";
import { createVehicle } from "./Vehicle";
import Charger from "../models/Charger";
import { NewBeaconType } from "../../types/Beacon";
import { VehicleType } from "../../types/Vehicle";
import { SafeUserType } from "../../types/User";

let prevDuringDay = false;
const generateChargerWithinRange = ({
  coordinates: [longitude, latitude],
  rangeMeters,
  offHours,
  disabled,
}: {
  coordinates: number[];
  rangeMeters: number;
  offHours?: boolean;
  disabled?: boolean;
}) => {
  const radiusInDegrees: number = rangeMeters / 111000.0;
  const u: number = Math.random();
  const v: number = Math.random();
  const w: number = radiusInDegrees * Math.sqrt(u);
  const t: number = 2 * Math.PI * v;
  const x: number = w * Math.cos(t);
  const y: number = w * Math.sin(t);
  const new_x: number = x / Math.cos(((x) => (x * Math.PI) / 180)(latitude));
  const foundLongitude: number = new_x + longitude;
  const foundLatitude: number = y + latitude;

  prevDuringDay = !prevDuringDay;

  return createCharger({
    owner: "5f68a882170de39b76935ee5",
    location: {
      coordinates: [foundLongitude, foundLatitude],
    },
    address: {
      street: "1 Main St",
      city: "New York",
      state: "New York",
      country: "United States of America",
    },
    plugType: "Tesla",
    ...(offHours != null && {
      offHoursStartUTC: prevDuringDay
        ? dayjs().add(2, "h").hour()
        : dayjs().subtract(2, "h").hour(),
      offHoursEndUTC: prevDuringDay
        ? dayjs().subtract(4, "h").hour()
        : dayjs().add(4, "h").hour(),
    }),
    ...(disabled != null && {
      disabledUntil: dayjs().add(7, "d").toDate(),
    }),
  });
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

describe("Beacon", () => {
  let owner: SafeUserType;
  let vehicle: VehicleType;
  let mockBeacon: NewBeaconType;
  beforeAll(async () => {
    const token = await signUp({
      email: "hello@hello.com",
      password: "somePass",
      name: "My Name",
    });

    owner = await getUser({ token });

    vehicle = await createVehicle({
      owner: owner._id,
      year: 2020,
      make: "Tesla",
      model: "3",
      color: "Grey",
      plugType: "Tesla",
      licensePlate: "1a2b3c",
    });

    mockBeacon = {
      owner: vehicle.owner,
      vehicle: vehicle._id,
      vehicleRange: 20 * 1609.34, // 20 Miles
      location: {
        coordinates: [1, 2],
      },
    };
  });

  beforeEach(async () => {
    // Clear all chargers
    await Charger.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should create a new beacon", async () => {
    const insertedBeacon = await createBeacon(mockBeacon);

    expect(insertedBeacon).not.toBeNull();
    expect(insertedBeacon.owner).toEqual(mockBeacon.owner);
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
    expect(insertedBeacon.owner).toEqual(mockBeacon.owner);
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
    expect(insertedBeacon.owner).toEqual(mockBeacon.owner);
    expect(insertedBeacon.vehicleRange).toEqual(mockBeacon.vehicleRange);

    // Generate chargers within range that are working
    const generatedChargers = (
      await Promise.all(
        [1, 2, 3].map(() =>
          generateChargerWithinRange({
            coordinates: insertedBeacon.location.coordinates,
            rangeMeters: insertedBeacon.vehicleRange,
          })
        )
      )
    ).map((charger) => charger._id.toString());

    // Generate chargers that are off hours
    await Promise.all(
      [1, 2, 3].map(() =>
        generateChargerWithinRange({
          coordinates: insertedBeacon.location.coordinates,
          rangeMeters: insertedBeacon.vehicleRange,
          offHours: true,
        })
      )
    );

    // Generate chargers that are disabled
    await Promise.all(
      [1, 2, 3].map(() =>
        generateChargerWithinRange({
          coordinates: insertedBeacon.location.coordinates,
          rangeMeters: insertedBeacon.vehicleRange,
          disabled: true,
        })
      )
    );

    const nearbyChargers = (
      await getNearbyChargers(insertedBeacon)
    ).map((charger) => charger._id.toString());

    expect(nearbyChargers).not.toBeNull();
    expect(generatedChargers.sort()).toEqual(nearbyChargers.sort());
  });

  it("should fail get nearby chargers when none around", async () => {
    const insertedBeacon = await createBeacon(mockBeacon);

    expect(insertedBeacon).not.toBeNull();
    expect(insertedBeacon.owner).toEqual(mockBeacon.owner);
    expect(insertedBeacon.vehicleRange).toEqual(mockBeacon.vehicleRange);

    try {
      await getNearbyChargers(insertedBeacon);
    } catch (error) {
      expect(error.message).toEqual("No nearby chargers!");
    }
  });

  it("should fail get nearby chargers when only disabled", async () => {
    const insertedBeacon = await createBeacon(mockBeacon);

    expect(insertedBeacon).not.toBeNull();
    expect(insertedBeacon.owner).toEqual(mockBeacon.owner);
    expect(insertedBeacon.vehicleRange).toEqual(mockBeacon.vehicleRange);

    // Generate chargers that are off hours
    await Promise.all(
      [1, 2, 3].map(() =>
        generateChargerWithinRange({
          coordinates: insertedBeacon.location.coordinates,
          rangeMeters: insertedBeacon.vehicleRange,
          offHours: true,
        })
      )
    );

    // Generate chargers that are disabled
    await Promise.all(
      [1, 2, 3].map(() =>
        generateChargerWithinRange({
          coordinates: insertedBeacon.location.coordinates,
          rangeMeters: insertedBeacon.vehicleRange,
          disabled: true,
        })
      )
    );

    try {
      await getNearbyChargers(insertedBeacon);
    } catch (error) {
      expect(error.message).toEqual("No nearby chargers!");
    }
  });

  it("should update beacon", async () => {
    const insertedBeacon = await createBeacon(mockBeacon);

    expect(insertedBeacon).not.toBeNull();
    expect(insertedBeacon.owner).toEqual(mockBeacon.owner);
    expect(insertedBeacon.vehicleRange).toEqual(mockBeacon.vehicleRange);

    const updateFields = {
      _id: insertedBeacon._id,
      charger: "5f68a882170de39b76935ee5",
    };

    const updatedBeacon = await updateBeaconCharger(updateFields);

    expect(updatedBeacon).not.toBeNull();
    expect(updatedBeacon.owner).toEqual(mockBeacon.owner);
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
    expect(insertedBeacon.owner).toEqual(mockBeacon.owner);
    expect(insertedBeacon.vehicleRange).toEqual(mockBeacon.vehicleRange);

    const canceledBeacon = await cancelBeacon({ _id: insertedBeacon._id });

    expect(canceledBeacon).not.toBeNull();
    expect(canceledBeacon.owner).toEqual(mockBeacon.owner);
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
