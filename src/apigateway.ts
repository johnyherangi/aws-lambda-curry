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
            const transformHandler = transform<
                APIGatewayProxyEvent,
                APIGatewayProxyResult,
                TTransforms
            >(transforms)(handler)

            return middleware(middlewares)(transformHandler)
        }
    }

    return transformFn
}
