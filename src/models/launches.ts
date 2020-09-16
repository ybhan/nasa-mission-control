import { log, flatMap } from "../deps.ts";

interface Launch {
  flightNumber: number;
  mission: string;
  rocket: string;
  customers: string[];
  launchDate: number;
  upcoming: boolean;
  success?: boolean;
  target?: string;
}

const launches = new Map<number, Launch>();
await downloadLaunchData();
log.info(`Downloaded data for ${launches.size} SpaceX launches.`);

async function downloadLaunchData() {
  log.info("Downloading launch data...");
  const response = await fetch("https://api.spacexdata.com/v3/launches", {
    method: "GET",
  });

  if (!response.ok) {
    log.warning("Problem downloading launch data.");
    throw new Error("Launch data download failed.");
  }

  const launchData = await response.json();
  for (const launch of launchData) {
    const payloads = launch["rocket"]["second_stage"]["payloads"];
    const customers = flatMap(payloads, (payload: any) => {
      return payload["customers"];
    });

    const flightData: Launch = {
      flightNumber: launch["flight_number"],
      mission: launch["mission_name"],
      rocket: launch["rocket"]["rocket_name"],
      launchDate: launch["launch_date_unix"],
      upcoming: launch["upcoming"],
      success: launch["launch_success"],
      customers,
    };

    launches.set(flightData.flightNumber, flightData);
  }
}

export function getLaunches(): Launch[] {
  return Array.from(launches.values());
}

export function getLaunch(id: number): Launch | null {
  return launches.get(id) ?? null;
}

export function addLaunch(data: Launch) {
  launches.set(
    data.flightNumber,
    Object.assign(data, {
      upcoming: true,
      customers: ["Yuanbo", "NASA"],
    }),
  );
}

export function deleteLaunch(id: number): Launch | null {
  const aborted = getLaunch(id);
  if (aborted) {
    aborted.upcoming = false;
    aborted.success = false;
  }
  return aborted;
}
