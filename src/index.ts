import ConfigSvc from '=services/ConfigSvc'
import LogSvc from '=services/LogSvc'
import ExecutionContext from '=components/ExecutionContext'

import { version } from '../package.json'

import { BOOT_BANNER } from './constants'

new ExecutionContext(async () => {
    await ConfigSvc.init()
    LogSvc.info(`Master Shoro ${version} is online!`)
    LogSvc.raw(BOOT_BANNER)
})
