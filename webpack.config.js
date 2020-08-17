const path = require('path')

const { NODE_ENV = 'production' } = process.env

module.exports = {
    entry: './src/index.ts',
    mode: NODE_ENV,
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
    },
    module: {
        rules: [
            {
                test: /\.(d\.)?ts$/,
                use: [ 'awesome-typescript-loader' ],
            },
        ],
    },
    resolve: {
        extensions: [ '.js', '.ts', '.d.ts' ],
        alias: {
            // App root alias
            '@app': path.resolve(__dirname, 'src'),
            // Ban index resolution
            '@app/index': path.resolve('/NONE'),
            '@app/index.ts': path.resolve('/NONE'),
            // Aliases for all kinds of stuff
            '=common': path.resolve(__dirname, 'src/common'),
            '=components': path.resolve(__dirname, 'src/components'),
            '=schemas': path.resolve(__dirname, 'src/schemas'),
            '=services': path.resolve(__dirname, 'src/services'),
            '=util': path.resolve(__dirname, 'src/util'),
        },
    },
}
