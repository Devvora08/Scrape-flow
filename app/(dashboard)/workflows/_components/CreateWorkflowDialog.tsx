"use client"

import CustomDialogHeader from '@/components/CustomDialogHeader'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Layers2Icon, Loader2 } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createWorkflowSchema, createWorkflowSchemaType } from '@/schema/workflow'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useMutation } from '@tanstack/react-query'
import { CreateWorkflow } from '@/actions/workflows/createWorkflow'
import { toast } from 'sonner'

const CreateWorkflowDialog = ({ triggerText }: { triggerText?: string }) => {

    const [open, setOpen] = useState(false)
    const form = useForm<createWorkflowSchemaType>({
        resolver: zodResolver(createWorkflowSchema),
        defaultValues: {},
    })

    const { mutate, isPending } = useMutation(
        {
            mutationFn: CreateWorkflow,
            onSuccess: () => {
                toast.success("Workflow created", { id: "create-workflow" })
            },
            onError: () => {
                toast.error("Failed to create Workflow", { id: "create-workflow " })
            }
        }
    )

    const onSubmit = useCallback((values: createWorkflowSchemaType) => {
        toast.loading("Creating Workflow...", { id: "create-workflow" })
        mutate(values)
    }, [mutate])

    return (
        <Dialog open={open} onOpenChange={(open) => {
            form.reset();
            setOpen(open)
        }}>
            <DialogTrigger asChild>
                <Button>
                    {triggerText ?? "Create Workflow"}
                </Button>
            </DialogTrigger>
            <DialogContent className='px-0'>
                <CustomDialogHeader
                    icon={Layers2Icon}
                    title="Create Workflow"
                    subTitle="Start building your workflow"
                />
                <div className='p-6'>
                    <Form {...form}>
                        <form className='space-y-4 w-full' onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex gap-1 items-center'>
                                        Name
                                        <p className='text-xs text-primary'>(required)</p>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Choose a descriptive and unique name
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}>
                            </FormField>

                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex gap-1 mt-4 items-center'>
                                        Description
                                        <p className='text-xs text-muted-foreground'>(optional)</p>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea className='resize-none' {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Provide a brief description of what your workflow does.
                                        <br /> This is an optional field but can help you remember the purpose of workflow
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}>
                            </FormField>

                            <Button type='submit' className='w-full mt-4' disabled={isPending}>
                                {!isPending && "Proceed"}
                                {isPending && <Loader2 className='animate-spin' />}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateWorkflowDialog
