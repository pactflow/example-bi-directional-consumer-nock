import * as fs from "fs";
import nock from "nock";
import * as path from "path";
import { fileURLToPath } from "url";
import pjson from "../package.json";
import { Api } from "./api.ts";

const nockBack = nock.back;
nockBack.setMode("record"); // record interactions
const fixtures = "fixtures"; // fixture files will be stored in ./fixtures/<fixture>.json
nockBack.fixtures = fixtures;
const filename = "nock.json";
const projectRoot = fileURLToPath(new URL("..", import.meta.url));

describe("API Nock Tests", () => {
  test("nock recordings", async () => {
    // recording of the fixture
    const { nockDone } = await nockBack(filename);
    const api = new Api("http://localhost:3001");

    // Record all of the data
    await api.getAllProducts();
    await api.getProduct("10");

    nockDone();
  });
});

// Crude converter from a nock fixture to a pactfile
export const convertNockToPact = () => {
  const scopes: nock.Definition[] = JSON.parse(
    fs.readFileSync(path.join(projectRoot, fixtures, filename), "utf8"),
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

  fs.mkdirSync(path.join(projectRoot, "pacts"), { recursive: true });
  fs.writeFileSync(
    path.join(projectRoot, "pacts", "nock-contract.json"),
    JSON.stringify(pact),
  );

  return scopes;
};
