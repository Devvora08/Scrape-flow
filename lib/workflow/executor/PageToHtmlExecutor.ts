import { ExecutionEnvironment } from '@/types/executor'

import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { PageToHtmlTask } from '../task/PageToHtml';

export async function PageToHtmExecutor(environment : ExecutionEnvironment<typeof PageToHtmlTask>): Promise<boolean> {
    try {
        const html = await environment.getPage()!.content()
        //console.log("@PAGE HTML :", html );     
        environment.setOutput("Html", html)   
        return true
    } catch (error:any) {
        environment.log.error(error.message)
        return false
    }
}