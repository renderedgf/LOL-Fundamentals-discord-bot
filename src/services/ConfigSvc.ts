import * as path from 'path'

import fs from 'common/async/fs'

import InvalidStateException from 'common/exceptions/InvalidStateException'
import MalformedConfigException from 'common/exceptions/MalformedConfigException'
import MissingConfigException from 'common/exceptions/MissingConfigException'
import SchemaValidator from 'util/SchemaValidator'
import authSchema from 'schemas/config/auth'
import loggingSchema from 'schemas/config/logging'

export interface AuthConfig {
    token: string
}

export interface LoggingConfig {
    collect?: {
        stdout?: boolean // false
        stderr?: boolean // true
    }
}

const CONFIG_DIR = 'config'
const AUTH_CONFIG = path.join(CONFIG_DIR, 'auth.json')
const LOGGING_CONFIG = path.join(CONFIG_DIR, 'logging.json')

export default class ConfigSvc {
    private static _AuthCfg: AuthConfig
    private static _LoggingCfg: LoggingConfig
    private static _initialized = false

    private static _guard(): void {
        if (!this._initialized)
            throw new InvalidStateException(
                'Attempted to access an unitialized config service!'
            )
    }

    private static async _load<T>(path: string): Promise<T> {
        try {
            const fileContent = (await fs.readFile(path)).toString('utf-8')

            // CAST: Unsafe if used outside of context
            const parsed = JSON.parse(fileContent) as T

            // No runtime modification
            return Object.freeze(parsed)
        } catch (e) {
            if (e instanceof Error) {
                if (e instanceof SyntaxError)
                    throw new MalformedConfigException(e.message, path)

                if (e.message.startsWith('ENOENT'))
                    throw new MissingConfigException(e.message, path)
            }

            throw e
        }
    }

    static async init(): Promise<void> {
        /* Promise.all because it'll shorten the bootup when there are more
         * config files (asynchronous resolutions for syscalls, etc.). */
        const [authCfg, logCfg] = await Promise.all([
            this._load<AuthConfig>(AUTH_CONFIG),
            this._load<LoggingConfig>(LOGGING_CONFIG),
        ])

        try {
            const authValidator = new SchemaValidator(authSchema)
            const loggingValidator = new SchemaValidator(loggingSchema)

            this._AuthCfg = authValidator.validate(authCfg)
            this._LoggingCfg = loggingValidator.validate(logCfg)
        } catch (e) {
            if (e instanceof Error)
                throw new MalformedConfigException(e.message)

            throw e
        }

        this._initialized = true
    }

    static get auth(): AuthConfig {
        this._guard()
        return this._AuthCfg
    }

    static get logging(): LoggingConfig {
        this._guard()
        return this._LoggingCfg
    }
}
