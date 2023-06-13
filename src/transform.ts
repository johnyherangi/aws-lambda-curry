import { Transform, TransformOutputHandler } from "./types"

export function transform<TEvent, TResult, TTransforms extends Transform<TEvent, any>[]>(
    transforms?: TTransforms,
): TransformOutputHandler<TEvent, TResult, TTransforms> {
    return function transformOutputHandler(handler) {
        return function lambdaFn(event, context) {
            const args = transforms?.map((transform) => transform(event, context)) as any
            return handler(args)
        }
    }
}
