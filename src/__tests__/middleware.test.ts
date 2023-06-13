import { Middleware, middleware } from "@src/middleware"
import { Context } from "aws-lambda"

describe("middleware.ts", () => {
    describe("middleware()", () => {
        it("wraps handler in middleware", () => {
            const middleware1: Middleware<number, number> = (e, c, next) => {
                return next(e + 1, c)
            }

            const handler = middleware([middleware1])((e) => e)
            expect(handler(1, {} as Context)).toBe(2)
        })
        it("accepts no middleware", () => {
            const handler = middleware()((e) => e)
            expect(handler(1, {} as Context)).toBe(1)
        })
    })
})
