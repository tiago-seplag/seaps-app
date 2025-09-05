import { UnauthorizedError } from "@/infra/errors";
import { db } from "@/infra/database";
import { compare } from "./password";

async function getAuthenticationUserByEmail(email: string, password: string) {
  try {
    const user = await findUserByEmail(email);
    await validatePassword(password, user.password);

    return user;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
      });
    }

    throw error;
  }

  async function validatePassword(
    providedPassword: string,
    storedPassword: string,
  ) {
    const correctPassowrdMatch = await compare(
      providedPassword,
      storedPassword,
    );

    if (!correctPassowrdMatch) {
      throw new UnauthorizedError({
        message: "Senha incorreta.",
        action: "Verifique se este dado está correto.",
      });
    }
  }
}

async function findUserByEmail(email: string) {
  const user = await db("users").select("*").where("email", email).first();

  if (!user || !user.password) {
    throw new UnauthorizedError({
      message: "Email ou Senha inválidos",
      action: "Verifique se os dados informados estão corretos",
    });
  }

  return user;
}

async function findUserByCpf(cpf: string) {
  const user = await db("users").select("*").where("cpf", cpf).first();

  if (!user) {
    return null;
  }

  return user;
}

export { getAuthenticationUserByEmail };

const authentication = {
  getAuthenticationUserByEmail,
  findUserByEmail,
  findUserByCpf,
};

export default authentication;
