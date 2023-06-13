import { Context } from "aws-lambda"
import { EventHandler, Middleware } from "./types"

export function middleware<TEvent, TResult>(middlewares?: Middleware<TEvent, TResult>[]) {
    const invoke = (
        event: TEvent,
        context: Context,
        handler: EventHandler<TEvent, TResult>,
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

        const next: EventHandler<TEvent, TResult> = (e, c) => {
            return invoke(e, c, handler, pipelineCopy)
        }

        return middleware(event, context, next)
    }

    return (handler: EventHandler<TEvent, TResult>): EventHandler<TEvent, TResult> => {
        return (e, c) => invoke(e, c, handler, middlewares)
    }
}
