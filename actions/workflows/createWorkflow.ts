"use server"

import prisma from "@/lib/prisma";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import {  createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflow";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { Workflow } from "lucide-react";
import { redirect } from "next/navigation";

export async function CreateWorkflow(form: createWorkflowSchemaType) {
    const {success, data} = createWorkflowSchema.safeParse(form);
    if(!success){
        throw new Error("Invalid Form Data !")
    }
    const {userId} = auth()
    if(!userId) throw new Error("Unauthenticated !")

    const initialFlow : {nodes: AppNode[]; edges: Edge[]} = {
        nodes: [],
        edges: [],
    }
    //add flow entry point
    initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER))

    const result = await prisma.worflow.create({
        data:{
            userId,
            status: WorkflowStatus.DRAFT,
            defination: JSON.stringify(initialFlow),
            ...data,
        }
    })

    if(!result) throw new Error("Failed to create Workflow")

    redirect(`/workflow/editor/${result.id}`)
}

