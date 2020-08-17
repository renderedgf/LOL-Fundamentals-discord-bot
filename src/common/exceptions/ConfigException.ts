import FatalException from './FatalException'

export default class ConfigException extends FatalException {
    constructor(message: string, path?: string) {
        if (path) super(`(${path}) ${message}`)
        else super(message)

        if (this.constructor === ConfigException) {
            this.name = 'ConfigException'
            this.exitCode = 254
        }
    }
}
