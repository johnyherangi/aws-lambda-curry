import { middleware } from "./middleware"
import { transform } from "./transform"
import { Middleware, Transform, TransformHandler } from "./types"

export function apigateway<TEvent, TResult>(middlewares?: Middleware<TEvent, TResult>[]) {
    return function <TTransforms extends Transform<TEvent, any>[]>(transforms?: TTransforms) {
        return function (handler: TransformHandler<TEvent, TResult, TTransforms>) {
            return middleware<TEvent, TResult>(middlewares)(
                transform<TEvent, TResult, TTransforms>(transforms)(handler),
            )
        }
    }
}
