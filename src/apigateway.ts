import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Middleware, middleware } from "./middleware"
import { Transform, TransformHandler, transform } from "./transform"

export function apigateway(
    middlewares?: Middleware<APIGatewayProxyEvent, APIGatewayProxyResult>[],
) {
    function transformFn<TTransforms extends Transform<APIGatewayProxyEvent, any>[]>(
        transforms: TTransforms,
    ) {
        return function (
            handler: TransformHandler<APIGatewayProxyEvent, APIGatewayProxyResult, TTransforms>,
        ) {
            return middleware(middlewares)(
                transform<APIGatewayProxyEvent, APIGatewayProxyResult, TTransforms>(transforms)(
                    handler,
                ),
            )
        }
    }

    return transformFn
}
