import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"
import { Handler } from "./handler"
import { Middleware, middleware } from "./middleware"
import { Transform, TransformHandler, transform } from "./transform"

export function getEvent() {
    return function <TEvent>(event: TEvent, _context: Context) {
        return event
    }
}

export function getContext() {
    return function <TEvent>(_event: TEvent, context: Context) {
        return context
    }
}

const defaultTransforms = [getEvent(), getContext()] as const

export function apigateway(
    middlewares?: Middleware<APIGatewayProxyEvent, APIGatewayProxyResult>[],
) {
    function transformFn<TTransforms extends Transform<APIGatewayProxyEvent, any>[]>(
        transforms: TTransforms,
    ): (
        handler: TransformHandler<APIGatewayProxyEvent, APIGatewayProxyResult, TTransforms>,
    ) => Handler<APIGatewayProxyEvent, APIGatewayProxyResult>

    function transformFn(): (
        handler: TransformHandler<
            APIGatewayProxyEvent,
            APIGatewayProxyResult,
            typeof defaultTransforms
        >,
    ) => Handler<APIGatewayProxyEvent, APIGatewayProxyResult>

    function transformFn<TTransforms extends Transform<APIGatewayProxyEvent, any>[]>(
        transforms?: TTransforms,
    ) {
        if (!transforms) {
            return function (handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult>) {
                return middleware(middlewares)(handler)
            }
        }

        return function (
            handler: TransformHandler<APIGatewayProxyEvent, APIGatewayProxyResult, TTransforms>,
        ) {
            return middleware(middlewares)(
                transform<APIGatewayProxyEvent, APIGatewayProxyResult, TTransforms>(
                    transforms ?? ([] as any),
                )(handler),
            )
        }
    }

    return transformFn
}
