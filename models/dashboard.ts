import { prisma } from "@/lib/prisma";

export async function getCountByRange() {
  const ranges: { range: string; total: number }[] = await prisma.$queryRaw`
    SELECT
        t.range,
        count(*) as total
    FROM 
        (
        SELECT 
            CASE
                WHEN score > 2.5 THEN 'BOM'
                WHEN score > 1.5 THEN 'REGULAR'
                ELSE 'RUIM'
            END AS 
                range
        FROM
            checklists
        WHERE
            status = 'CLOSED'
        ) t
    GROUP BY
	    t.range
    ;
    `;

  const formattedRanges = ranges.map((range) => ({
    ...range,
    total: Number(range.total),
  }));

  return formattedRanges;
}
