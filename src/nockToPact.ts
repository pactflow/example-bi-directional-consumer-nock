import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import type nock from "nock";
import pjson from "../package.json" with { type: "json" };

const projectRoot = fileURLToPath(new URL("..", import.meta.url));

export const fixturesDir = "fixtures"; // fixture files are stored in ./fixtures/<fixture>.json
export const fixtureFile = "nock.json";

// Crude converter from a nock fixture to a pactfile
export const convertNockToPact = () => {
  const scopes: nock.Definition[] = JSON.parse(
    readFileSync(join(projectRoot, fixturesDir, fixtureFile), "utf8"),
  );

  const pact = {
    consumer: { name: "pactflow-example-bi-directional-consumer-nock" },
    provider: {
      name:
        process.env.PACT_PROVIDER ??
        "pactflow-example-bi-directional-provider-dredd",
    },
    interactions: scopes.map((interaction) => ({
      description: `nock_${interaction.method}_${interaction.path}_${interaction.status}`,
      request: {
        method: interaction.method,
        path: interaction.path,
        body: interaction.body,
      },
      response: {
        status: interaction.status,
        body: interaction.response,
      },
    })),
    metadata: {
      pactSpecification: {
        version: "2.0.0",
      },
      client: {
        name: "pact-nock-adapter",
        version: pjson.version,
      },
    },
  };

  mkdirSync(join(projectRoot, "pacts"), { recursive: true });
  writeFileSync(
    join(projectRoot, "pacts", "nock-contract.json"),
    JSON.stringify(pact),
  );

  return scopes;
};
