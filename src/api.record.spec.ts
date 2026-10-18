import nock from "nock";
import { Api } from "./api.ts";
import { fixtureFile, fixturesDir } from "./nockToPact.ts";

const nockBack = nock.back;
nockBack.setMode("record"); // record interactions
nockBack.fixtures = fixturesDir;

describe("API Nock Tests", () => {
  test("nock recordings", async () => {
    // recording of the fixture
    const { nockDone } = await nockBack(fixtureFile);
    const api = new Api("http://localhost:3001");

    // Record all of the data
    await api.getAllProducts();
    await api.getProduct("10");

    nockDone();
  });
});
