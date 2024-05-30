import { io } from "./server";

import { UserType } from "./types";

import { insideOfRange } from "./utils";
import getAllUsers from "./services/firebase/getAllUsers";

const onUserAskToMatch = async (user: UserType) => {
  let allFirebaseUsers = await getAllUsers();

  const lang = user.matchingConfig.lang;
  const { from, to } = user.matchingConfig;

  const filteredLang = allFirebaseUsers.filter(
    (p) => p?.matchingConfig?.lang === lang
  );

  const filteredAge = filteredLang.filter((p) => {
    const f = p?.matchingConfig?.from;
    const t = p?.matchingConfig?.to;

    return (
      insideOfRange(p?.age, [from, to]) && insideOfRange(user?.age, [f, t])
    );
  });

  const filteredGender = filteredAge.filter((p) => {
    if (p?.matchingConfig?.genders?.includes(user?.gender)) {
      if (user?.matchingConfig?.genders?.includes(p?.gender)) {
        return true;
      }
    }
    return false;
  });

  const randomIndex = Math.floor(Math.random() * filteredGender.length);
  return filteredGender[randomIndex];
};

io.on("connection", (socket: any) => {
  const userBlock = async (user: UserType): Promise<boolean> => {
    if (!user?.id || user?.age < 18) return true;
    if (!user?.matchingConfig) return true;
    if (!user?.matchingConfig?.from) return true;
    if (!user?.matchingConfig?.to) return true;
    if (!user?.matchingConfig?.genders) return true;
    if (!user?.matchingConfig?.lang) return true;
    return false;
  };

  socket.once("match_user", async (user: UserType) => {
    if ((await userBlock(user)) === true) return;
    const usr = await onUserAskToMatch(user);
    console.log(usr);
    socket.emit("match_user:response", usr);
  });

  socket.on("disconnect", (reason: any) => {
    console.log(`\nuser exist: ${socket.id}`);
  });
});
