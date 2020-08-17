import * as fs from 'fs'
import * as stream from 'stream'
import ConfigSvc from '=services/ConfigSvc'

const _DATE_FORMAT = '[%s]'
const _LOG_DIR = 'log'

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

        let stdout: stream.Writable = process.stdout
        let stderr: stream.Writable = process.stderr

        if (ConfigSvc.initialized) {
            const now = Date.now()
            const { collect } = ConfigSvc.logging

            if (!fs.existsSync(_LOG_DIR)) fs.mkdirSync(_LOG_DIR)

            if (collect?.stdout)
                stdout = fs.createWriteStream(`./${_LOG_DIR}/${now}-out.log`)
            if (collect?.stderr)
                stderr = fs.createWriteStream(`./${_LOG_DIR}/${now}-err.log`)
        }

        this._Logger = new console.Console({
            /* TODO: Depending on ConfigSvc, write STDOUT to a separate
             * date-labeled file just like it's done for STDERR. */
            stdout,
            stderr,
        })

        return this._Logger
    }

    /**
     * Format the date for logs. If there's no message, returns the current date
     * in ISO format, decorated as per `_DATE_FORMAT`. If a message is provided,
     * it will be prefixed with the current time.
     *
     * @param message - Optional message to include.
     *
     * @returns Formatted time / Formatted time with message.
     */
    private static fmtDate(message?: string): string {
        const formattedTime = _DATE_FORMAT.replace(
            '%s',
            new Date().toISOString()
        )

        return message ? `${formattedTime} ${message}` : formattedTime
    }

    static raw(message: string): void {
        process.stdout.write(message);
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
