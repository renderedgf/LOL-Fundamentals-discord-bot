import ty from 'schemas/common/typeLabels'

export default {
    ...ty.obj(),
    properties: {
        collect: {
            ...ty.obj(
                'Flags telling if output streams are to be written into files'
            ),
            properties: {
                stdout: ty.bool('Log stdout?'),
                stderr: ty.bool('Log stderr?'),
            },
        },
    },
}
