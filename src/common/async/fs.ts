import * as fs from 'fs'

export const readFile = (path: string): Promise<Buffer> =>
    new Promise((res, rej) =>
        fs.readFile(path, (err, data) => (err ? rej(err) : res(data)))
    )

export default {
    readFile,
}
