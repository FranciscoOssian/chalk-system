import { UserType } from "../../types";
import adm from "./init";
import NodeCache from "node-cache";

const db = adm.firestore();

const myCache = new NodeCache();
const cacheKey = `collection_Users`;

const collectionRef = db.collection("Users");

// Inicializa o cache com os dados da coleção de usuários
collectionRef
  .get()
  .then((snapshot) => {
    if (!snapshot.empty) {
      const users: any[] = [];
      snapshot.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
      });
      myCache.set(cacheKey, users);
      console.log(users);
    }
  })
  .catch((error) => {
    console.error("Erro ao inicializar o cache de usuários:", error);
  });

// Listener para monitorar alterações na coleção de usuários
db.collection("Users").onSnapshot(
  (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const userData = change.doc.data();
      if (change.type === "added") {
        addUserToCache({ ...userData, id: change.doc.id });
      }
      if (change.type === "modified") {
        updateUserInCache({ ...userData, id: change.doc.id });
      }
      if (change.type === "removed") {
        removeUserFromCache({ ...userData, id: change.doc.id });
      }
    });
  },
  (err) => {
    console.log(`Erro ao ouvir mudanças na coleção: ${err}`);
  }
);

// Função para adicionar um usuário ao cache
const addUserToCache = (user: any) => {
  const cachedUsers: any[] = myCache.get(cacheKey) || [];
  cachedUsers.push(user);
  myCache.set(cacheKey, cachedUsers);
};

// Função para atualizar um usuário no cache
const updateUserInCache = (user: any) => {
  const cachedUsers: any[] = myCache.get(cacheKey) || [];
  const index = cachedUsers.findIndex((u) => u.id === user.id);
  if (index !== -1) {
    cachedUsers[index] = user;
    myCache.set(cacheKey, cachedUsers);
  }
};

// Função para remover um usuário do cache
const removeUserFromCache = (user: any) => {
  const cachedUsers: any[] = myCache.get(cacheKey) || [];
  const updatedUsers = cachedUsers.filter((u) => u.id !== user.id);
  myCache.set(cacheKey, updatedUsers);
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Função para retornar todos os usuários do cache
export const getAllUsers = async (): Promise<UserType[]> => {
  return myCache.get(cacheKey) || [];
};

export default getAllUsers;
