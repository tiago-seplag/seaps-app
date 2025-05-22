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
                WHEN classification = 2 THEN 'BOM'
                WHEN classification = 1 THEN 'REGULAR'
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
    ORDER BY 
        t.status;
    ;
    `;

  return ranges;
}

export async function getOrganizationsIGM() {
  const result: {
    organization_id: string;
    name: string;
    qtd_bom: number;
    qtd_regular: number;
    qtd_ruim: number;
    total_imoveis: number;
    irm: number;
    classificacao_igmi: number;
  }[] = await prisma.$queryRaw`
    WITH classificacao_por_orgao AS (
    SELECT
        organization_id,
        organizations.name,
        SUM(CASE WHEN classification = 2 THEN 1 ELSE 0 END) AS qtd_bom,
        SUM(CASE WHEN classification = 1 THEN 1 ELSE 0 END) AS qtd_regular,
        SUM(CASE WHEN classification = 0 THEN 1 ELSE 0 END) AS qtd_ruim,
        COUNT(*) AS total_imoveis
    FROM
        checklists
    INNER JOIN 
        organizations
    ON
        organizations.id = checklists.organization_id
    GROUP BY
        organization_id,
        organizations.id
    ),
    classificacao_final AS (
    SELECT
        organization_id,
        name,
        qtd_bom,
        qtd_regular,
        qtd_ruim,
        total_imoveis,
        ROUND((qtd_bom + qtd_regular)::numeric / NULLIF(total_imoveis, 0), 2) AS irm,
        CASE
        WHEN qtd_bom > total_imoveis * 0.8 THEN 2
        WHEN qtd_bom > total_imoveis * 0.6 AND qtd_regular > qtd_ruim THEN 2
        WHEN qtd_bom <= total_imoveis * 0.6 AND qtd_regular > qtd_ruim THEN 1
        WHEN qtd_ruim >= qtd_regular THEN 0
        ELSE -1
        END AS classificacao_igmi
    FROM
        classificacao_por_orgao
    )
    SELECT
    organization_id,
    name,
    qtd_bom::integer,
    qtd_regular::integer,
    qtd_ruim::integer,
    total_imoveis::integer,
    irm::float,
    classificacao_igmi::integer
    FROM
    classificacao_final
    ORDER BY
    classificacao_igmi desc,
    irm DESC
    ;
    `;

  return result;
}
