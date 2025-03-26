import { prisma } from "@/lib/prisma";

export async function getCountByRange() {
  const ranges: { status: string; total: number }[] = await prisma.$queryRaw`
    SELECT
        t.status,
        count(*)::integer as total
    FROM 
        (
        SELECT 
            CASE
                WHEN score > 2.5 THEN 'BOM'
                WHEN score > 1.5 THEN 'REGULAR'
                ELSE 'RUIM'
            END AS 
                status
        FROM
            checklists
        WHERE
            status = 'CLOSED'
        ) t
    GROUP BY
	    t.status
    ;
    `;

  return ranges;
}
