import * as fs from 'fs'

const _dateFormat = '[%s]'

/**
 * Service that handles logging.
 */
export default class LogSvc {
    private static _Logger: Console

    /**
     * [Get] the underlying instance.
     */
    private static get __logger(): Console {
        if (this._Logger) return this._Logger

        const now = Date.now()
        /* Create a stream associated with the initialization time. Basically
         * "make a log file for the current process". */
        const errorStream = fs.createWriteStream(`./error-${now}.log`)
        this._Logger = new console.Console({
            /* TODO: Depending on ConfigSvc, write STDOUT to a separate
             * date-labeled file just like it's done for STDERR. */
            stdout: process.stdout,
            stderr: errorStream,
        })

        return this._Logger
    }

    /**
     * Format the date for logs. If there's no message, returns the current date
     * in ISO format, decorated as per `_dateFormat`. If a message is provided,
     * it will be prefixed with the current time.
     *
     * @param message - Optional message to include.
     *
     * @returns Formatted time / Formatted time with message.
     */
    private static fmtDate(message?: string): string {
        const formattedTime = _dateFormat.replace(
            '%s',
            new Date().toISOString()
        )

        return message ? `${formattedTime} ${message}` : formattedTime
    }

    /**
     * STDOUT:
     * Write a message.
     *
     * @param message - A message.
     */
    static info(message: string): void {
        this.__logger.log(this.fmtDate(`(INFO) ${message}`))
    }

    /**
     * STDOUT:
     * Write a status message.
     *
     * @param message - A status message.
     */
    static status(message: string): void {
        this.__logger.log(this.fmtDate(`(STAT) ${message}`))
    }

    /**
     * STDERR:
     * Write a warning.
     *
     * @param message - A warning message.
     * @param includeTrace - Optional trace inclusion flag.
     */
    static warn(message: string, includeTrace?: boolean): void {
        this.__logger.warn(this.fmtDate(`(WARN) ${message}`))
        if (includeTrace) this.__logger.trace()
    }

    /**
     * STDERR:
     * Write an error.
     *
     * @param message - An error message.
     * @param includeTrace - Optional trace inclusion flag.
     */
    static error(message: string, includeTrace?: boolean): void {
        this.__logger.error(this.fmtDate(`(ERR!) ${message}`))
        if (includeTrace) this.__logger.trace()
    }
}
