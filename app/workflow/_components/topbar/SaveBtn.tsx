"use client"

import { updateWorkflow } from '@/actions/workflows/updateWorkflow'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { useReactFlow } from '@xyflow/react'
import { CheckIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'


const SaveBtn = ({workflowId}: {workflowId : string}) => {
    
  const {toObject} = useReactFlow()  

  const saveMutation = useMutation({
    mutationFn: updateWorkflow,
    onSuccess: () => {
        toast.success('Flow saved successfully !', {id: 'save-workflow'})
    },
    onError: () => {
        toast.error('Something went wrong', {id: 'save-workflow'})
    }
  })

  return (
    <Button disabled={saveMutation.isPending} className='flex items-center gap-2' variant={'outline'} onClick={()=> {
        const workflowDefination = JSON.stringify(toObject());
        toast.loading("Saving the workflow....", {id: 'save-workflow'})
        saveMutation.mutate({
            id: workflowId,
            defination: workflowDefination
        })
    }}>
        <CheckIcon size={16} className='stroke-purple-950'/>
        Save
     </Button>
  )
}

export default SaveBtn
