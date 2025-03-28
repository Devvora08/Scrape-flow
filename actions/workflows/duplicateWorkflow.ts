"use server"

import prisma from "@/lib/prisma";
import { duplicateWorkflowSchema, duplicateWorkflowSchemaType } from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function DuplicateWorkflow(form: duplicateWorkflowSchemaType) {
    const {success, data} = duplicateWorkflowSchema.safeParse(form);
    if(!success) throw new Error("invalid form data");

    const {userId} = auth()
    if(!userId) throw new Error("unauthenticated user");

    const sourceWorkflow = await prisma.worflow.findUnique({
        where: {
            id: data.workflowId, 
            userId,
        }
    })

    if(!sourceWorkflow) throw new Error("workflow not found !!");

    const result = await prisma.worflow.create({
        data: {
            userId,
            name: data.name,
            description: data.description,
            status: WorkflowStatus.DRAFT,
            defination: sourceWorkflow.defination,
        }
    })

    if(!result) {
        throw new Error("failed to duplicate workflow")
    }

    revalidatePath("/workflows")
}