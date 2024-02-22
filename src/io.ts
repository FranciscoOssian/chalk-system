import { io } from "./server";
import Bucket from "./bucket";

import { UserType } from "./types";

const langsBucket = new Bucket<UserType>();

import { insideOfRange } from "./utils";

const onUserAdd = (user: UserType, socketId: string) => {
  const lang = user.matchingConfig.lang;
  const { from, to } = user.matchingConfig;

  langsBucket.add(lang, socketId, user);

  console.log(langsBucket.getAllBuckets());

  const filteredLang = langsBucket
    .get(lang)
    .filter((p) => p.data.uid !== user.uid);

  const filteredAge = filteredLang.filter((p) => {
    const f = p.data.matchingConfig.from;
    const t = p.data.matchingConfig.to;
    return (
      insideOfRange(p.data.age, [from, to]) && insideOfRange(user.age, [f, t])
    );
  });

  const filteredGender = filteredAge.filter((p) => {
    if (p.data.matchingConfig.genders.includes(user.gender)) {
      if (user.matchingConfig.genders.includes(p.data.gender)) {
        return true;
      }
    }
    return false;
  });

  if (!!filteredGender[0]) {
    langsBucket.remove(lang, filteredGender[0].id);
    langsBucket.remove(lang, socketId);
    console.log("match finded");
    io.to(filteredGender[0].id).emit("match", user);
    io.to(socketId).emit("match", filteredGender[0].data);
  }
};

const logUserEnter = (user: UserType) =>
  console.log(`\n user ender -> fbUid: ${user.uid}`);

io.on("connection", (socket: any) => {
  socket.once("add_user", (user: UserType) => {
    if (!user?.uid || user?.age < 18) return;
    if (!user?.matchingConfig) return;
    if (!user?.matchingConfig?.from) return;
    if (!user?.matchingConfig?.to) return;
    if (!user?.matchingConfig?.genders) return;
    if (!user?.matchingConfig?.lang) return;
    logUserEnter(user);
    onUserAdd(user, socket.id);
  });

  socket.on("disconnect", (reason: any) => {
    console.log(`\nuser exist: ${socket.id}`);
    langsBucket.remove(null, socket.id);
  });
});
