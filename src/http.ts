import { http } from "./server";
import admin from "./services/firebase/init";
import * as fastq from "fastq";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 2, // 2 req for IP
});

const queueInvite = fastq.promise(worker, 1);

const getUserRef = (id: string) =>
  admin.firestore().collection("Users").doc(id);

async function worker(id: string) {
  try {
    console.log("Processando tarefa:", id);
    const userRef = getUserRef(id);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      return;
    }

    const userData = userSnapshot.data();
    const currentInvites = userData?.invites || 0;

    await userRef.update({ invites: currentInvites + 1 });

    return {
      done: true,
    };
  } catch (error) {
    console.error("Error updating user data:", error);
    return {
      done: false,
      error: error,
    };
  }
}

http.get("/invite/:id", limiter, async (req, res) => {
  const id = req.params.id;
  const result = await queueInvite.push(id);
  res.jsonp(result);
});

http.get("/", async (req, res) => {
  res.send("working");
});
