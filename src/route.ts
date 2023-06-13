import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { EventHandler, HttpMethod, Middleware, Route } from "./types"

export function httpRoute(httpMethod: HttpMethod) {
    return function path(path: string) {
        return function handler(
            handler: EventHandler<APIGatewayProxyEvent, APIGatewayProxyResult>,
        ): Route<APIGatewayProxyEvent, APIGatewayProxyResult> {
            return [httpMethod, path, handler]
        }
    }
}

export function httpRoutes(routes: Route<APIGatewayProxyEvent, APIGatewayProxyResult>[]) {
    return function middleware(
        middleware?: Middleware<APIGatewayProxyEvent, APIGatewayProxyResult>[],
    ): EventHandler<APIGatewayProxyEvent, APIGatewayProxyResult> {
        return (event, context) => {
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
    }
}

const handler: EventHandler<APIGatewayProxyEvent, APIGatewayProxyResult> = (e, c) => {
    return {
        statusCode: 200,
        body: "",
    }
}

const route1 = httpRoute("GET")("/example")(handler)

const routeList = [route1]

const routeHandler = httpRoutes(routeList)()
