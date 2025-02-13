"use server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const createProject = async (values: {
  name: string;
  organization_id?: string;
  steps?: {
    name: string;
    order?: number;
  }[];
}) => {
  const { steps, ...data } = values;

  const project = await prisma.project.create({ data: { ...data } });

  if (steps)
    await prisma.step.createMany({
      data: steps.map((value) => ({ project_id: project.id, ...value })),
    });

  redirect("/");
};
