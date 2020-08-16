import ty from 'schemas/common/typeLabels'

export default {
    ...ty.obj(),
    required: ['token'],
    properties: {
        token: ty.str('Access token for Discord Bot API'),
    },
}
