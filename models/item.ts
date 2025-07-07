import { db } from "@/infra/database";

interface IItem {
  name: string;
}

async function findOrInsert(item: IItem) {
  const name = item.name.trim().toUpperCase();

  const findItem = await db("items").where("name", name).first();

  if (!findItem) {
    const [createdItem] = await db("items")
      .insert({ name: name })
      .returning("*");

    return createdItem;
  }

  return findItem;
}

const item = {
  findOrInsert,
};

export default item;
