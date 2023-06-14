import { Context } from "aws-lambda"

export type Transform<TEvent, TResult> = (event: TEvent, context: Context) => TResult

export type TransformOutputs<TEvent, TResult, TTransforms extends Transform<TEvent, TResult>[]> = {
    [K in keyof TTransforms]: ReturnType<TTransforms[K]>
}

export type TransformHandler<TEvent, TResult, TTransform extends Transform<TEvent, TResult>[]> = (
    args: TransformOutputs<TEvent, TResult, TTransform>,
) => TResult | Promise<TResult>

export function transform<TEvent, TResult, TTransforms extends Transform<TEvent, any>[]>(
    transforms?: TTransforms,
) {
    return function (handler: TransformHandler<TEvent, TResult, TTransforms>) {
        return function (event: TEvent, context: Context) {
            const args = transforms?.map((t) => t(event, context)) as any
            return handler(args)
        }
    }
}
