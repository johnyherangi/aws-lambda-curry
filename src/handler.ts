import { Context } from "aws-lambda"

export type Handler<TEvent, TResult> = (
    event: TEvent,
    context: Context,
) => TResult | Promise<TResult>
