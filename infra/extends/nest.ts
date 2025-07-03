/* eslint-disable @typescript-eslint/no-explicit-any */
import knex from "knex";

export function nest() {
  knex.QueryBuilder.extend("nest", function (): any {
    return this.then((results: any[]) => {
      return results.map((row) => {
        const nested: any = {};

        for (const key in row) {
          if (key.includes(":")) {
            const [parentKey, childKey] = key.split(":");

            if (!nested[parentKey]) nested[parentKey] = {};
            nested[parentKey][childKey] = row[key];

            continue;
          }

          nested[key] = row[key];
        }

        return nested;
      });
    });
  });
}
