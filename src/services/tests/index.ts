import { sleep } from "../../utils";

export const beforeAll = async (done: any) => {
  await sleep(4000);
  await done();
};

export async function describe(
  description: string,
  tests: () => Promise<void>
) {
  await beforeAll(async () => {
    console.log(description);
    await tests();
  });
}

export function logIt(description: string, success: boolean) {
  //const emoji = success ? "✔️" : "❌";
  //const color = success ? "\x1b[32m" : "\x1b[31m"; // verde para sucesso, vermelho para falha
  //const resetColor = "\x1b[0m";
  //console.log(`${color}  ${emoji} ${description}${resetColor}`);

  console.log("    >", description);
}

export async function it(
  description: string,
  test: () => Promise<void> | void
) {
  try {
    test();
    logIt(description, true); // sucesso
  } catch (error) {
    logIt(description, false); // falha
  }
}
