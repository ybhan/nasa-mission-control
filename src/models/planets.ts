import { log, join, parse, BufReader, pick } from "../deps.ts";

type Planet = Record<string, string>;

export const planets: Planet[] = await loadPlanetData()
  .then((planets: Planet[]) => {
    log.info(`${planets.length} habitable planets found!`);
    return planets;
  });

export default planets;

async function loadPlanetData(): Promise<Planet[]> {
  const path: string = join("data", "kepler_exoplanets_nasa.csv");
  const file: Deno.File = await Deno.open(path);
  const bufReader: BufReader = new BufReader(file);

  const exoplanets = await parse(bufReader, {
    header: true,
    comment: "#",
  });

  Deno.close(file.rid);

  const habitablePlanets: Planet[] = filterHabitablePlanets(
    exoplanets as Planet[],
  );

  return habitablePlanets.map((planet) => {
    return pick(planet, [
      "kepler_name",
      "koi_prad",
      "koi_smass",
      "koi_srad",
      "koi_count",
      "koi_steff",
    ]);
  });
}

export function filterHabitablePlanets(planets: Array<Planet>) {
  return planets.filter((planet) => {
    const planetaryRadius = Number(planet["koi_prad"]);
    const stellarRadius = Number(planet["koi_srad"]);
    const stellarMass = Number(planet["koi_smass"]);

    return planet["koi_disposition"] === "CONFIRMED" &&
      0.5 < planetaryRadius && planetaryRadius < 1.5 &&
      0.98 < stellarRadius && stellarRadius < 1.02 &&
      0.78 < stellarMass && stellarMass < 1.04;
  });
}
