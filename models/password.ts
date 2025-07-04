import bcrypt from "bcrypt";

async function hash(password: string) {
  const rounds = getNumberOfRounds();

  return bcrypt.hash(password, rounds);
}

async function compare(providedPassword: string, storedPassword: string) {
  return bcrypt.compare(providedPassword, storedPassword);
}

function getNumberOfRounds() {
  let rounds = 1;

  if (process.env.NODE_ENV === "production") {
    rounds = 14;
  }

  return rounds;
}

export { hash, compare };
