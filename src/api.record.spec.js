import * as fs from "fs";
import nock from "nock";
import * as path from "path";
import { fileURLToPath } from "url";
import pjson from "../package.json";
import { API } from "./api";

const nockBack = nock.back;
nockBack.setMode("record"); // record interactions
nockBack.fixtures = "fixtures"; // fixture files will be stored in ./fixtures/<fixture>.json
const filename = "nock.json";
const projectRoot = fileURLToPath(new URL("..", import.meta.url));

describe("API Nock Tests", () => {
  test("nock recordings", () => {
    // recording of the fixture
    return nockBack(filename).then(async ({ nockDone }) => {
      const api = new API("http://localhost:3001");

      // Record all of the data
      await api.getAllProducts();
      await api.getProduct("10");

      nockDone();
    });
  });
});

// Crude converter from a nock fixture to a pactfile
export const convertNockToPact = () => {
  const scopes = JSON.parse(
    fs.readFileSync(path.join(projectRoot, nockBack.fixtures, filename), "utf8")
  );

  const pact = {
    consumer: { name: "pactflow-example-bi-directional-consumer-nock" },
    provider: {
      name: process.env.PACT_PROVIDER
        ? process.env.PACT_PROVIDER
        : "pactflow-example-bi-directional-provider-dredd",
    },
    interactions: [],
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

  pact.interactions = scopes.map((interaction) => {
    return {
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
    };
  });

  try {
    fs.mkdirSync(path.join(projectRoot, "pacts"));
  } catch (e) {
    // writeFileSync fails if dir doesnt exist
    // mkdirSync fails if dir exists
  }
  fs.writeFileSync(
    path.join(projectRoot, "pacts", "nock-contract.json"),
    JSON.stringify(pact)
  );

  return scopes;
};
