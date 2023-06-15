import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"
import { Handler } from "./handler"
import { Middleware, middleware } from "./middleware"

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

export type Route<TEvent, TResult> = [HttpMethod, string, Handler<TEvent, TResult>]

export function httpRoute(httpMethod: HttpMethod) {
    return function path(path: string) {
        return function handler(
            handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult>,
        ): Route<APIGatewayProxyEvent, APIGatewayProxyResult> {
            return [httpMethod, path, handler]
        }
    }
}

export function httpRoutes(routes: Route<APIGatewayProxyEvent, APIGatewayProxyResult>[]) {
    return function middlewareFn(
        middlewares?: Middleware<APIGatewayProxyEvent, APIGatewayProxyResult>[],
    ): Handler<APIGatewayProxyEvent, APIGatewayProxyResult> {
        const routeHandler = (event: APIGatewayProxyEvent, context: Context) => {
            const match = routes.find((route) => {
                const [httpMethod, path] = route
                return event.httpMethod === httpMethod && event.path === path
            })

            if (!match) {
                throw new Error("ROUTE_NOT_FOUND")
            }

            const [, , handler] = match
            return handler(event, context)
        }

        return middleware(middlewares)(routeHandler)
    }
}
