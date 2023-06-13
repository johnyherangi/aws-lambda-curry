import { Context } from "aws-lambda"

export type EventHandler<TEvent, TResult> = (
    event: TEvent,
    context: Context,
) => TResult | Promise<TResult>

export type HttpMethod =
    | "CONNECT"
    | "DELETE"
    | "GET"
    | "HEAD"
    | "OPTIONS"
    | "PATCH"
    | "POST"
    | "PUT"
    | "TRACE"

export type Middleware<TEvent, TResult> = (
    event: TEvent,
    context: Context,
    next: EventHandler<TEvent, TResult>,
) => TResult | Promise<TResult>

export type MiddlewareBuilder<TEvent, TResult> = (
    middlewares?: Middleware<TEvent, TResult>[],
) => (handler: EventHandler<TEvent, TResult>) => EventHandler<TEvent, TResult>

export type Route<TEvent, TResult> = [string, string, EventHandler<TEvent, TResult>]

export type Transform<TEvent, TResult> = (event: TEvent, context: Context) => TResult

export type TransformOutputs<TEvent, TResult, TTransforms extends Transform<TEvent, TResult>[]> = {
    [K in keyof TTransforms]: ReturnType<TTransforms[K]>
}

export type TransformHandler<
    TEvent,
    TResult,
    TTransform extends Array<Transform<TEvent, TResult>>,
> = (args: TransformOutputs<TEvent, TResult, TTransform>) => TResult | Promise<TResult>

export type TransformBuilder<
    TEvent,
    TResult,
    TTransform extends Array<Transform<TEvent, TResult>>,
> = (handler: TransformHandler<TEvent, TResult, TTransform>) => EventHandler<TEvent, TResult>
