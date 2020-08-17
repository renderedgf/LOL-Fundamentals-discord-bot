import FatalException from './FatalException'

export default class InvalidStateException extends FatalException {
    exitCode = 253
    name = 'InvalidStateException'
}
