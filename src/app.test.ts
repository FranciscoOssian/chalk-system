//import "./index.ts";

import io from "socket.io-client";
import axios from "axios";

import assert from "assert";
import { describe, it } from "./services/tests/index.js";
import { UserType } from "./types.js";

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
  await it("Should recive new user call to match", async () => {
    const socket = io("http://localhost:8000");
    socket.on("connect", async () => {
      const me: UserType = {
        name: "dlns",
        bio: "lkdn",
        age: 18,
        gender: "Man",
        id: "edwed",
        profilePicture: "sdc",
        authenticated: true,
        matchingConfig: {
          from: 18,
          to: 18,
          lang: "pt-BR",
          genders: ["Woman", "Man", "Transgender", "Prefer not to state"],
        },
      };
      socket.emit("match_user", me);
      socket.on("match_user:response", (usr) => console.log("found", usr));
    });
  });
});
