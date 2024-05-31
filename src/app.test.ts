//import "./index.ts";

import io from "socket.io-client";
import axios from "axios";

import assert from "assert";
import { describe, it } from "./services/tests/index.js";
import { UserType } from "./types.js";
/*
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
*/
describe("WebSocket Connection", async () => {
  await it("Should recive new user call to match", async () => {
    const socket = io("http://localhost:8000");
    socket.on("connect", async () => {
      const me: UserType = {
        age: 18,
        authenticated: false,
        bio: "<bio>",
        gender: "Prefer not to state",
        id: "OoxQMr2F2Xei3QqnHGMvQkjRgaJ3",
        matchingConfig: {
          from: 18,
          genders: [
            "Woman",
            "Man",
            "Transgender",
            "Non-Binary",
            "Prefer not to state",
          ],
          lang: "pt-BR",
          to: 95,
        },
        name: "Anon",
        profilePicture:
          "file:///data/user/0/com.foln.chalk/files//a946f61d65424bc869eb614a959b8550a373e1d44df869c0cdcefa554f687df4",
      };
      socket.emit("match_user", me);
      socket.on("match_user:response", (usr) => console.log("found", usr));
    });
  });
});
