"use server"

import { waitFor } from "@/lib/helper/waitFor";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateWorkflow({id, defination}: {id:string; defination: string}) {
    await waitFor(3000)
    const {userId} = auth()
    if(!userId) throw new Error('Unauthenticated !')

    const workflow = await prisma.worflow.findUnique({
        where: {
            id,
            userId,
        }
    })

    if(!workflow) throw new Error("Workflow not found !")
    if(workflow.status !== WorkflowStatus.DRAFT) throw new Error("Workflow is not a draft")

    await prisma.worflow.update({
        data: {
            defination,
        },
        where: {
            id,
            userId
        },
    })

    revalidatePath('/workflows')
}