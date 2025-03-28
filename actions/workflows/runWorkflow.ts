"use server"

import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger, WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";



export async function runWorkflow(form: { workflowId: string; flowDefination?: string }) {
    const { userId } = auth()
    if (!userId) throw new Error("Unauthenticated");

    const { workflowId, flowDefination } = form;
    if (!workflowId) {
        throw new Error("WorkflowId is required !!")
    }

    const workflow = await prisma.worflow.findUnique({
        where: {
            userId,
            id: workflowId,
        },
    })

    if (!workflow) throw new Error("Workdflow not found")

    let executionPlan: WorkflowExecutionPlan;
    let workflowDefination = flowDefination
    if (workflow.status === WorkflowStatus.PUBLISHED) {
        if (!workflow.executionPlan) {
            throw new Error("no execution plan found in published workflow")
        }
        executionPlan = JSON.parse(workflow.executionPlan)
        workflowDefination = workflow.defination
    } else {
        if (!flowDefination) throw new Error("flow defination is not defined")

        const flow = JSON.parse(flowDefination)
        const result = FlowToExecutionPlan(flow.nodes, flow.edges)
        if (result.error) {
            throw new Error("Flow defination not valid")
        }

        if (!result.executionPlan) throw new Error("No execution plan generated")

        executionPlan = result.executionPlan;
    }



    //console.log("execution plan ", executionPlan)
    const execution = await prisma.workflowExecution.create({
        data: {
            workflowId,
            userId,
            status: WorkflowExecutionStatus.PENDING,
            startedAt: new Date(),
            trigger: WorkflowExecutionTrigger.MANUAL,
            defination: workflowDefination,
            phases: {
                create: executionPlan.flatMap((phase) => {
                    return phase.nodes.flatMap((node) => {
                        return {
                            userId,
                            status: ExecutionPhaseStatus.CREATED,
                            number: phase.phase,
                            node: JSON.stringify(node),
                            name: TaskRegistry[node.data.type].label,
                        }
                    })
                })
            }
        },
        select: {
            id: true,
            phases: true,
        }
    });

    if (!execution) throw new Error("Workflow Execution not created !");

    ExecuteWorkflow(execution.id)
    redirect(`/workflow/runs/${workflowId}/${execution.id}`)
}