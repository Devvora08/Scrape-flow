import { ExecutionEnvironment } from '@/types/executor'

import { FillInputTask } from '../task/Fillinput';
import { waitFor } from '@/lib/helper/waitFor';

export async function FillInputExecutor(environment : ExecutionEnvironment<typeof FillInputTask>): Promise<boolean> {
    try {
        const selector = environment.getInput("Selector");
        if(!selector) {
            environment.log.error("Input -> selector not defined")
        }

        const value = environment.getInput("Value");
        if(!value) {
            environment.log.error('Input -> value not defined');
        }

        await environment.getPage()!.type(selector, value)
        //await waitFor(5000)
        return true
    } catch (error:any) {
        environment.log.error(error.message)
        return false
    }
}