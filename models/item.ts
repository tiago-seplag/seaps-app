import { db } from "@/infra/database";

interface IItem {
  name: string;
}

interface IItem {
  id: string;
  name: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

async function findOrInsert(item: IItem) {
  const name = item.name.trim().toUpperCase();

  const findItem = await db<IItem>("items")
    .select("*")
    .where("name", name)
    .first();

  if (!findItem) {
    const [createdItem] = await db<IItem>("items")
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
