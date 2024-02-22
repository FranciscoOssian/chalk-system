import "./index.ts";

import io from "socket.io-client";
import axios from "axios";

import assert from "assert";
import { randomInt } from "crypto";
import { sleep } from "./utils.js";

const beforeAll = async (done: any) => {
  await sleep(4000);
  await done();
};

async function describe(description: string, tests: () => Promise<void>) {
  await beforeAll(async () => {
    console.log(description);
    await tests();
  });
}

function logIt(description: string, success: boolean) {
  //const emoji = success ? "✔️" : "❌";
  //const color = success ? "\x1b[32m" : "\x1b[31m"; // verde para sucesso, vermelho para falha
  //const resetColor = "\x1b[0m";
  //console.log(`${color}  ${emoji} ${description}${resetColor}`);

  console.log("    >", description);
}

async function it(description: string, test: () => Promise<void> | void) {
  try {
    test();
    logIt(description, true); // sucesso
  } catch (error) {
    logIt(description, false); // falha
  }
}

describe("GET /", async () => {
  await it("should return status 200", async () => {
    const response = await axios.get("http://localhost:8000/");
    assert.strictEqual(response.status, 200);
  });
});

describe("GET /invite/:id", async () => {
  await it("should return status 200", async () => {
    const response = await axios.get(
      "http://localhost:8000/invite/0_User_For_Tests"
    );
    assert.strictEqual(response.status, 200);
    assert.equal(response.data.done, true);
  });
});

describe("WebSocket Connection", async () => {
  async function sendUser(user: any, done: any) {
    const socket = io("http://localhost:8000");
    const userToSend = {
      name: user.name,
      bio: user.bio,
      age: user.age,
      gender: user.gender,
      uid: user.uid,
      profilePicture: "",
      authenticated: user.authenticated,
      matchingConfig: user.matchingConfig,
    };
    socket.on("connect", async () => {
      socket.emit("add_user", userToSend);
      socket.on("match", done);
    });
    return () => {
      socket.disconnect();
    };
  }

  const makeMockUser = (user?: any) => ({
    name: `${randomInt(18, 100)}-name`,
    bio: `${randomInt(18, 100)}-bio`,
    age: user?.age ?? randomInt(18, 100),
    gender: user?.gender ?? "",
    uid: randomInt(1000),
    profilePicture: "",
    authenticated: randomInt(0, 1) ? true : false,
    matchingConfig: {
      lang: user?.matchingConfig.lang ?? randomInt(0, 1) ? "pt" : "en",
      from: user?.matchingConfig.from ?? user?.age ?? randomInt(18, 50),
      to: user?.matchingConfig.to ?? user?.age ?? randomInt(50, 100),
      genders: [
        "Woman",
        "Man",
        "Transgender",
        "Non-Binary",
        "Prefer not to state",
      ],
    },
  });

  await it("should connect and send user", async () => {
    const onMatch = (u: any) => {
      console.log("matching", u.uid);
    };
    await sendUser(
      makeMockUser({
        age: 18,
        gender: "Man",
        matchingConfig: {
          lang: "pt",
          from: 18,
          to: 18,
        },
      }),
      onMatch
    );
    await sendUser(
      makeMockUser({
        age: 18,
        gender: "Man",
        matchingConfig: {
          lang: "pt",
          from: 18,
          to: 18,
        },
      }),
      onMatch
    );
  });
});
