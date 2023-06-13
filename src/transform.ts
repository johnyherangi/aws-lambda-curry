import { Context } from "aws-lambda"
import { Handler } from "./handler"

export type Transform<TEvent, TResult> = (event: TEvent, context: Context) => TResult

export type TransformOutputs<TEvent, TResult, TTransforms extends Transform<TEvent, TResult>[]> = {
    [K in keyof TTransforms]: ReturnType<TTransforms[K]>
}

export type TransformHandler<TEvent, TResult, TTransform extends Transform<TEvent, TResult>[]> = (
    args: TransformOutputs<TEvent, TResult, TTransform>,
) => TResult | Promise<TResult>

export type TransformBuilder<TEvent, TResult, TTransforms extends Transform<TEvent, TResult>[]> = (
    transforms: TTransforms,
) => (handler: TransformHandler<TEvent, TResult, TTransforms>) => Handler<TEvent, TResult>

export type EmptyTransformBuilder<TEvent, TResult> = () => (
    handler: Handler<TEvent, TResult>,
) => Handler<TEvent, TResult>

export function transform<TEvent, TResult, TTransforms extends Transform<TEvent, any>[]>(
    transforms: TTransforms,
): (handler: TransformHandler<TEvent, TResult, TTransforms>) => Handler<TEvent, TResult>

export function transform<TEvent, TResult>(): (
    handler: Handler<TEvent, TResult>,
) => Handler<TEvent, TResult>

export function transform<TTransforms extends Transform<TEvent, any>[], TEvent, TResult>(
    transforms?: TTransforms,
) {
    if (!transforms) {
        return function (handler: Handler<TEvent, TResult>) {
            return handler
        }
    }

    return function (handler: TransformHandler<TEvent, TResult, TTransforms>) {
        return function (event: TEvent, context: Context) {
            const args = transforms?.map((t) => t(event, context)) as any
            return handler(args)
        }
    }
}
