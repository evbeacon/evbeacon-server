import mongoose from "mongoose";
import dayjs from "dayjs";
import User from "../models/User";
import Charger from "../models/Charger";
import {
  createBeacon,
  getBeacon,
  updateBeaconCharger,
  cancelBeacon,
} from "./Beacon";
import { signUp } from "./Auth";
import { createCharger } from "./Charger";
import { createVehicle } from "./Vehicle";
import { getNearbyChargers } from "../utils/Beacon";
import type { CreateBeaconParams } from "../../types/actions/beacon";
import type { VehicleType } from "../../types/vehicle";
import type { SafeUserType } from "../../types/user";
import type { CreateChargerParams } from "../../types/actions/charger";

let prevDuringDay = false;
const generateChargerWithinRange = (
  user: SafeUserType,
  {
    coordinates: [longitude, latitude],
    rangeMeters,
    offHours,
    disabled,
  }: {
    coordinates: number[];
    rangeMeters: number;
    offHours?: boolean;
    disabled?: boolean;
  }
) => {
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

  if (offHours != null) {
    prevDuringDay = !prevDuringDay;
  }

  const currentDate = dayjs().utc();

  return createCharger(user, {
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
    ...(offHours === true && {
      offHoursStartUTC: prevDuringDay
        ? currentDate.add(3, "h").hour() * 60
        : currentDate.subtract(2, "h").hour() * 60,
      offHoursEndUTC: prevDuringDay
        ? currentDate.add(1, "h").hour() * 60
        : currentDate.add(4, "h").hour() * 60,
    }),
    ...(disabled === true && {
      disabledUntil: dayjs().add(7, "d").toDate(),
    }),
  });
};

describe("Beacon", () => {
  let admin: SafeUserType;
  let vehicle: VehicleType;
  let mockBeacon: CreateBeaconParams;
  let mockCharger: CreateChargerParams;
  beforeAll(async () => {
    const { user } = await signUp({
      email: "beacon@hello.com",
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

    vehicle = await createVehicle(admin, {
      year: 2020,
      make: "Tesla",
      model: "3",
      color: "Grey",
      plugType: "Tesla",
      licensePlate: "1a2b3c",
    });

    mockBeacon = {
      vehicle: vehicle._id,
      vehicleRange: 20 * 1609.34, // 20 Miles
      location: {
        coordinates: [1, 2],
      },
    };

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

  beforeEach(async () => {
    // Clear all chargers
    await Charger.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should create a new beacon", async () => {
    const insertedBeacon = await createBeacon(admin, mockBeacon);

    expect(insertedBeacon).not.toBeNull();
    expect(insertedBeacon.owner.toString()).toEqual(admin._id.toString());
    expect(insertedBeacon.vehicleRange).toEqual(mockBeacon.vehicleRange);
  });

  it("should fail createBeacon on null value", async () => {
    try {
      await createBeacon(admin, { vehicleRange: null } as any);
    } catch (error) {
      expect(error.message).toEqual("All parameters must be provided!");
    }
  });

  it("should get beacon from beaconId", async () => {
    const insertedBeacon = await createBeacon(admin, mockBeacon);

    expect(insertedBeacon).not.toBeNull();
    expect(insertedBeacon.owner.toString()).toEqual(admin._id.toString());
    expect(insertedBeacon.vehicleRange).toEqual(mockBeacon.vehicleRange);

    const gotBeacon = await getBeacon(admin, { _id: insertedBeacon._id });
    expect(gotBeacon).toEqual(insertedBeacon);
  });

  it("should fail getBeacon on missing beaconId", async () => {
    try {
      await getBeacon(admin, { _id: null as any });
    } catch (error) {
      expect(error.message).toEqual("BeaconID must be provided!");
    }
  });

  it("should fail getBeacon on missing beacon", async () => {
    try {
      await getBeacon(admin, { _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Beacon does not exist!");
    }
  });

  it("should get nearby chargers", async () => {
    const insertedBeacon = await createBeacon(admin, mockBeacon);

    expect(insertedBeacon).not.toBeNull();
    expect(insertedBeacon.owner.toString()).toEqual(admin._id.toString());
    expect(insertedBeacon.vehicleRange).toEqual(mockBeacon.vehicleRange);

    // Generate chargers within range that are working
    const generatedChargers = (
      await Promise.all(
        [1, 2, 3].map(() =>
          generateChargerWithinRange(admin, {
            coordinates: insertedBeacon.location.coordinates,
            rangeMeters: insertedBeacon.vehicleRange,
          })
        )
      )
    ).map((charger) => charger._id.toString());

    // Generate chargers that are off hours
    await Promise.all(
      [1, 2, 3].map(() =>
        generateChargerWithinRange(admin, {
          coordinates: insertedBeacon.location.coordinates,
          rangeMeters: insertedBeacon.vehicleRange,
          offHours: true,
        })
      )
    );

    // Generate chargers that are disabled
    await Promise.all(
      [1, 2, 3].map(() =>
        generateChargerWithinRange(admin, {
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
    const insertedBeacon = await createBeacon(admin, mockBeacon);

    expect(insertedBeacon).not.toBeNull();
    expect(insertedBeacon.owner.toString()).toEqual(admin._id.toString());
    expect(insertedBeacon.vehicleRange).toEqual(mockBeacon.vehicleRange);

    const nearby = await getNearbyChargers(insertedBeacon);

    expect(nearby.length).toEqual(0);
  });

  it("should fail get nearby chargers when only disabled", async () => {
    const insertedBeacon = await createBeacon(admin, mockBeacon);

    expect(insertedBeacon).not.toBeNull();
    expect(insertedBeacon.owner.toString()).toEqual(admin._id.toString());
    expect(insertedBeacon.vehicleRange).toEqual(mockBeacon.vehicleRange);

    // Generate chargers that are off hours
    await Promise.all(
      [1, 2, 3, 4].map(() =>
        generateChargerWithinRange(admin, {
          coordinates: insertedBeacon.location.coordinates,
          rangeMeters: insertedBeacon.vehicleRange,
          offHours: true,
        })
      )
    );

    // Generate chargers that are disabled
    await Promise.all(
      [1, 2, 3, 4].map(() =>
        generateChargerWithinRange(admin, {
          coordinates: insertedBeacon.location.coordinates,
          rangeMeters: insertedBeacon.vehicleRange,
          disabled: true,
        })
      )
    );

    const nearby = await getNearbyChargers(insertedBeacon);

    expect(nearby.length).toEqual(0);
  });

  it("should update beacon", async () => {
    const insertedBeacon = await createBeacon(admin, mockBeacon);

    expect(insertedBeacon).not.toBeNull();
    expect(insertedBeacon.owner.toString()).toEqual(admin._id.toString());
    expect(insertedBeacon.vehicleRange).toEqual(mockBeacon.vehicleRange);

    const updateFields = {
      _id: insertedBeacon._id,
      charger: "5f68a882170de39b76935ee5",
    };

    const updatedBeacon = await updateBeaconCharger(admin, updateFields);

    expect(updatedBeacon).not.toBeNull();
    expect(updatedBeacon.owner.toString()).toEqual(admin._id.toString());
    expect(updatedBeacon.allowedChargers[0].toString()).toEqual(
      updateFields.charger
    );
  });

  it("should fail updateBeaconCharger on missing beaconId", async () => {
    try {
      const insertedCharger = await createCharger(admin, mockCharger);

      await updateBeaconCharger(admin, {
        _id: null,
        charger: insertedCharger._id,
      } as any);
    } catch (error) {
      expect(error.message).toEqual("BeaconID must be provided!");
    }
  });

  it("should fail updateBeaconCharger on missing beacon", async () => {
    try {
      const insertedCharger = await createCharger(admin, mockCharger);

      await updateBeaconCharger(admin, {
        _id: "5f68a882170de39b76935ee5",
        charger: insertedCharger._id,
      } as any);
    } catch (error) {
      expect(error.message).toEqual("Beacon does not exist!");
    }
  });

  it("should fail updateBeaconCharger on missing chargerId", async () => {
    try {
      const insertedBeacon = await createBeacon(admin, mockBeacon);

      await updateBeaconCharger(admin, {
        _id: insertedBeacon._id,
        charger: null as any,
      });
    } catch (error) {
      expect(error.message).toEqual("ChargerID must be provided!");
    }
  });

  it("should fail updateBeaconCharger on missing charger", async () => {
    try {
      const insertedBeacon = await createBeacon(admin, mockBeacon);

      await updateBeaconCharger(admin, {
        _id: insertedBeacon._id,
        charger: "5f68a882170de39b76935ee5",
      });
    } catch (error) {
      expect(error.message).toEqual("Charger does not exist!");
    }
  });

  it("should cancel beacon", async () => {
    const insertedBeacon = await createBeacon(admin, mockBeacon);

    expect(insertedBeacon).not.toBeNull();
    expect(insertedBeacon.owner.toString()).toEqual(admin._id.toString());
    expect(insertedBeacon.vehicleRange).toEqual(mockBeacon.vehicleRange);

    await cancelBeacon(admin, {
      _id: insertedBeacon._id,
    });
  });

  it("should fail cancelBeacon on missing beaconId", async () => {
    try {
      await cancelBeacon(admin, { _id: null as any });
    } catch (error) {
      expect(error.message).toEqual("BeaconID must be provided!");
    }
  });

  it("should fail cancelBeacon on missing beacon", async () => {
    try {
      await cancelBeacon(admin, { _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Beacon does not exist!");
    }
  });
});
