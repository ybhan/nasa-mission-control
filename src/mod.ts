import { log, Application, send } from "./deps.ts";

import api from "./api.ts";

const app = new Application();

const PORT: number = Number(Deno.env.get("PORT")) || 8000;

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("INFO"),
  },
  loggers: {
    default: {
      level: "INFO",
      handlers: ["console"],
    },
  },
});

app.addEventListener("error", (event) => {
  log.error(event.error);
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.response.body = "Internal server error";
    throw err;
  }
});

app.use(async (ctx, next) => {
  const start: number = Date.now();
  await next();
  const delta: number = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${delta}ms`);
  log.info(`${ctx.request.method} ${ctx.request.url}: ${delta}ms`);
});

// Backend API
app.use(api.routes());
app.use(api.allowedMethods());

// Frontend static page
app.use(async (ctx) => {
  const filePath: string = ctx.request.url.pathname;
  const fileWhitelist: string[] = [
    "/",
    "/index.html",
    "/scripts/script.js",
    "/styles/style.css",
    "/images/favicon.png",
    "/videos/space.mp4",
  ];
  if (fileWhitelist.includes(filePath)) {
    await send(ctx, filePath, {
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  } else {
    ctx.response.redirect("/");
  }
});

if (import.meta.main) {
  log.info(`Starting server on port ${PORT}...`);
  await app.listen({
    port: PORT,
  });
}
