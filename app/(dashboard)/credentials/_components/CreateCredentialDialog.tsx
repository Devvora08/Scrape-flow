"use client"

import CustomDialogHeader from '@/components/CustomDialogHeader'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Layers2Icon, Loader2, ShieldEllipsis } from 'lucide-react'
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
import { createCredentialSchema, createCredentialSchemaType } from '@/schema/credential'
import { createCredential } from '@/actions/credentials/createCredential'

const CreateCredentialDialog = ({ triggerText }: { triggerText?: string }) => {

    const [open, setOpen] = useState(false)
    const form = useForm<createCredentialSchemaType>({
        resolver: zodResolver(createCredentialSchema),
    })

    const { mutate, isPending } = useMutation(
        {
            mutationFn: createCredential,
            onSuccess: () => {
                toast.success("Credential created", { id: "create-credential" });
                form.reset()
                setOpen(false);
            },
            onError: () => {
                toast.error("Failed to create Credential", { id: "create-credential" })
            }
        }
    )

    const onSubmit = useCallback((values: createCredentialSchemaType) => {
        toast.loading("Creating Credential...", { id: "create-credential" })
        mutate(values)
    }, [mutate])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    {triggerText ?? "Create"}
                </Button>
            </DialogTrigger>
            <DialogContent className='px-0'>
                <CustomDialogHeader
                    icon={ShieldEllipsis}
                    title="Create Credential"
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
                                        Enter a unique and descriptive name for the credential <br />
                                        This name will be used to identify the credentials
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}>
                            </FormField>

                            <FormField control={form.control} name="value" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex gap-1 mt-4 items-center'>
                                        Value
                                        <p className='text-xs text-primary'>(required)</p>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea className='resize-none' {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the value associated with this credential 
                                        <br /> This value will be securely encypted and stored
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

export default CreateCredentialDialog
