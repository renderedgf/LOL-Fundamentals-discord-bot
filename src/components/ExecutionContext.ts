import FatalException from '=common/exceptions/FatalException'
import LogSvc from '=services/LogSvc'

export default class ExecutionContext {
    constructor(rootTask: () => Promise<void>) {
        void this._run(rootTask)
    }

    async _run(rootTask: () => Promise<void>): Promise<void> {
        try {
            await rootTask()
            LogSvc.error('Foo')
        } catch (e) {
            if (e instanceof FatalException) {
                LogSvc.error([e.name, e.message].join(': '))
                process.exit(e.exitCode)
            }

            void e
        }
    }
}
