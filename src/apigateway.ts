import { middleware } from "./middleware"
import { transform } from "./transform"
import { Middleware, Transform, TransformOutputHandler } from "./types"

export function apigateway<TEvent, TResult>(middlewares?: Middleware<TEvent, TResult>[]) {
    return function <TTransforms extends Transform<TEvent, any>[]>(
        transforms?: TTransforms,
    ): TransformOutputHandler<TEvent, TResult, TTransforms> {
        return function (handler) {
            return middleware<TEvent, TResult>(middlewares)(
                transform<TEvent, TResult, TTransforms>(transforms)(handler),
            )
        }
    }
}
