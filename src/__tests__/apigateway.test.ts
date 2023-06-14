import { apigateway } from "@src/apigateway"
import { Middleware } from "@src/middleware"
import { Transform } from "@src/transform"
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"

describe("apigateway.ts", () => {
    describe("apigateway()", () => {
        it("creates apigateway handler", () => {
            const getPath: Transform<APIGatewayProxyEvent, string> = (e, c) => e.path

            const middleware1: Middleware<APIGatewayProxyEvent, APIGatewayProxyResult> = (
                e,
                c,
                next,
            ) => next(e, c)

            const handler = apigateway([middleware1])([getPath])(([path]) => {
                return {
                    statusCode: 200,
                    body: path,
                }
            })

            const event = {
                httpMethod: "GET",
                path: "/example",
            } as APIGatewayProxyEvent

            expect(handler(event, {} as Context)).toMatchSnapshot()
        })
    })
})
