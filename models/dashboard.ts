import { db } from "@/infra/database";

export async function getCountByRange() {
  const ranges = await db.raw(`
        SELECT
            CASE
                c.classification
                WHEN 0 THEN 'RUIM'
                WHEN 1 THEN 'REGULAR'
                WHEN 2 THEN 'BOM'
                ELSE 'DESCONHECIDO'
            END AS status,
            COUNT(c.classification) AS total
        FROM
            checklists c
        WHERE
            c.status = 'CLOSED'
        GROUP BY
            c.classification
        ORDER BY
            c.classification;
    `);

  return ranges.rows;
}

export async function getOrganizationsIGM() {
  const result = await db.raw(`
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
    `);

  return result.rows;
}

async function properties() {
  const ranges = await db.raw(`
    SELECT
	    count(DISTINCT(c.property_id)) as total
    FROM
        checklists c
    WHERE
        c.status = 'CLOSED'
    AND
        c.is_deleted = false
    `);

  return ranges.rows;
}

const dashboard = {
  getCountByRange,
  getOrganizationsIGM,
  properties,
};

export default dashboard;
