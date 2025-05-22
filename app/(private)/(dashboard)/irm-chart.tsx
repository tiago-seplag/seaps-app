"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const status = {
  0: {
    color: "hsl(var(--chart-5))",
    label: "Gestão Vulnerável",
  },
  1: {
    color: "hsl(var(--chart-1))",
    label: "Gestão em Aperfeiçoamento",
  },
  2: {
    color: "hsl(var(--chart-2))",
    label: "Gestão Adequada",
  },
};

type STATU_TYPE = 0 | 1 | 2;

const chartConfig = {
  total: {
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type Data = {
  organization_id: string;
  name: string;
  qtd_bom: number;
  qtd_regular: number;
  qtd_ruim: number;
  total_imoveis: number;
  irm: number;
  classificacao_igmi: number;
};

export function IRMBarComponent({ data }: { data: Data[] }) {
  return (
    <Card className="col-span-1 border-none p-0 shadow-none sm:col-span-2">
      <CardHeader>
        <CardTitle>Classificação geral dos órgãos e entidades</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <YAxis domain={[0, 1]} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  className="w-[180px]"
                  formatter={(value, _, item) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                        style={
                          {
                            "--color-bg": `${status[item.payload.classificacao_igmi as STATU_TYPE].color}`,
                          } as React.CSSProperties
                        }
                      />
                      Índice
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        {value}
                      </div>
                      <div className="flex basis-full items-center text-xs font-medium text-foreground">
                        {item.payload.name}
                      </div>
                      <div className="flex basis-full items-center border-t pt-1 text-xs font-medium text-foreground">
                        {
                          status[item.payload.classificacao_igmi as STATU_TYPE]
                            .label
                        }
                      </div>
                    </>
                  )}
                />
              }
              cursor={false}
              defaultIndex={1}
            />
            <Bar dataKey="irm" fill="var(--color-total)" radius={4}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={status[entry.classificacao_igmi as STATU_TYPE].color}
                />
              ))}
            </Bar>
            <ChartTooltip label="classificacao_igmi" key="var(--color-total)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
