import { Context } from "aws-lambda"
import { Transform, TransformHandler } from "./types"

export function transform<TEvent, TResult, TTransforms extends Transform<TEvent, any>[]>(
    transforms?: TTransforms,
) {
    return function (handler: TransformHandler<TEvent, TResult, TTransforms>) {
        return function (event: TEvent, context: Context) {
            const args = transforms?.map((transform) => transform(event, context)) as any
            return handler(args)
        }
    }
}
