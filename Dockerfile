FROM hayd/alpine-deno:1.4.0

ENV SHELL /bin/sh

WORKDIR /app

USER deno

COPY . .

# Cache the dependencies
RUN deno cache --reload --lock=lock.json src/deps.ts
# Compile the main app so that it doesn't need to be compiled each startup/entry
RUN deno cache --lock=lock.json src/mod.ts
# Drakefile.ts dependencies are not in deps.ts, so need to cache separately
RUN deno cache Drakefile.ts

EXPOSE 8000

CMD ["run", "--allow-all", "Drakefile.ts", "start"]