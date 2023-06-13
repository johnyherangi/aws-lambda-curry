import { Handler } from "@src/handler"
import { httpRoute, httpRoutes } from "@src/route"
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"
import { Middleware } from ".."

describe("route.ts", () => {
    describe("httpRoute()", () => {
        it("creates http route", () => {
            const handler1: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = (e) => {
                return {
                    statusCode: 200,
                    body: "",
                }
            }

            const route = httpRoute("GET")("/example")(handler1)
            const [httpMethod, path] = route

            expect(httpMethod).toBe("GET")
            expect(path).toBe("/example")
        })
    })
    describe("httpRoutes()", () => {
        it("creates http route handler", () => {
            const handler1: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = (e) => {
                return {
                    statusCode: 200,
                    body: "",
                }
            }

            const middleware1: Middleware<APIGatewayProxyEvent, APIGatewayProxyResult> = (
                e,
                c,
                next,
            ) => next(e, c)

            const route1 = httpRoute("GET")("/example")(handler1)
            const handler = httpRoutes([route1])([middleware1])

            const event = {
                httpMethod: "GET",
                path: "/example",
            } as APIGatewayProxyEvent

            expect(handler(event, {} as Context)).toMatchSnapshot()
        })
        it("throws ROUTE_NOT_FOUND error", () => {
            const handler = httpRoutes([])()

            const event = {
                httpMethod: "GET",
                path: "/example",
            } as APIGatewayProxyEvent

            expect(() => handler(event, {} as Context)).toThrow("ROUTE_NOT_FOUND")
        })
    })
})
