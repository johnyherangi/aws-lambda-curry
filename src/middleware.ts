import { Context } from "aws-lambda"
import { Handler } from "./handler"

export type Middleware<TEvent, TResult> = (
    event: TEvent,
    context: Context,
    next: Handler<TEvent, TResult>,
) => TResult | Promise<TResult>

export function middleware<TEvent, TResult>(middlewares?: Middleware<TEvent, TResult>[]) {
    const invoke = (
        event: TEvent,
        context: Context,
        handler: Handler<TEvent, TResult>,
        pipeline?: Middleware<TEvent, TResult>[],
    ): TResult | Promise<TResult> => {
        if (!pipeline) {
            return handler(event, context)
        }

        const pipelineCopy = [...pipeline]
        const middleware = pipelineCopy.pop()

        if (!middleware) {
            return handler(event, context)
        }

        const next: Handler<TEvent, TResult> = (e, c) => {
            return invoke(e, c, handler, pipelineCopy)
        }

        return middleware(event, context, next)
    }

    return (handler: Handler<TEvent, TResult>): Handler<TEvent, TResult> => {
        return (e, c) => invoke(e, c, handler, middlewares)
    }
}
