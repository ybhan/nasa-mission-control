import { desc, task, sh, run } from "https://deno.land/x/drake@v1.3.2/mod.ts";

desc("Run App");
task("start", [], async function () {
  await sh(
    "deno run --lock=lock.json --allow-net --allow-read src/mod.ts --port=8000",
  );
});

desc("Run App via denon for development");
task("dev", [], async function () {
  await sh(
    "denon run --lock=lock.json --allow-net --allow-read src/mod.ts --port=8000",
  );
});

desc("Run tests");
task("test", [], async function () {
  await sh("deno test --allow-read");
});

desc("Cache and lock dependencies");
task("lock", [], async function () {
  await sh("deno cache --lock=lock.json --lock-write src/deps.ts");
});

desc("Install denon for development");
task("install-denon", [], async function () {
  await sh(
    "deno install --allow-read --allow-run --allow-write --allow-net -f -q --unstable https://deno.land/x/denon@2.4.0/denon.ts",
  );
});

run();
