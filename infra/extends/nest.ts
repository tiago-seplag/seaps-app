/* eslint-disable @typescript-eslint/no-explicit-any */
import knex from "knex";

export function nest() {
  knex.QueryBuilder.extend("nest", function (): any {
    return this.then((results: any[] | any) => {
      if (Array.isArray(results)) {
        return results.map(nestRow);
      }

      if (results === undefined || results === null) {
        return results;
      }

      return nestRow(results);

      function nestRow(flat: Record<string, any>) {
        const nested: Record<string, any> = {};

        for (const key in flat) {
          if (!flat.hasOwnProperty(key)) continue;

          if (!key.includes(":")) {
            nested[key] = flat[key];
            continue;
          }

          const parts = key.split(":");
          let target = nested;

          for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!target[part]) target[part] = {};
            target = target[part];
          }

          target[parts[parts.length - 1]] = flat[key];
        }

        return nested;
      }
    });
  });
}
