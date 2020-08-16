type Primitive<T extends string> = {
    type: T
    description?: string
}

const mkLabel = <T extends string>(t: T) => (
    description?: string
): Primitive<T> => ({
    type: t,
    description,
})

export default {
    arr: mkLabel('array'),
    bool: mkLabel('boolean'),
    int: mkLabel('integer'),
    null: mkLabel('null'),
    num: mkLabel('number'),
    obj: mkLabel('object'),
    str: mkLabel('string'),
}
