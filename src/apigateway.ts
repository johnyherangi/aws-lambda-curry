import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Handler } from "./handler"
import { Middleware, middleware } from "./middleware"
import { Transform, TransformHandler, transform } from "./transform"

export function apigateway(
    middlewares?: Middleware<APIGatewayProxyEvent, APIGatewayProxyResult>[],
): <TTransforms extends Transform<APIGatewayProxyEvent, any>[]>(
    transforms: TTransforms,
) => (
    handler: TransformHandler<APIGatewayProxyEvent, APIGatewayProxyResult, TTransforms>,
) => Handler<APIGatewayProxyEvent, APIGatewayProxyResult>

export function apigateway(
    middlewares?: Middleware<APIGatewayProxyEvent, APIGatewayProxyResult>[],
): () => (
    handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult>,
) => Handler<APIGatewayProxyEvent, APIGatewayProxyResult>

export function apigateway(
    middlewares?: Middleware<APIGatewayProxyEvent, APIGatewayProxyResult>[],
) {
    function transformFn<TTransforms extends Transform<APIGatewayProxyEvent, any>[]>(
        transforms: TTransforms,
    ): (
        handler: TransformHandler<APIGatewayProxyEvent, APIGatewayProxyResult, TTransforms>,
    ) => Handler<APIGatewayProxyEvent, APIGatewayProxyResult>

    function transformFn(): (
        handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult>,
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
