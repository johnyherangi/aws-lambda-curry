import { Transform, TransformHandler, transform } from "@src/transform"
import { Context } from "aws-lambda"

describe("transform.ts", () => {
    describe("transform()", () => {
        it("wraps handler in middleware", () => {
            const transform1: Transform<string, number> = (e, c) => Number(e)

            function typeStrongTransform<T extends Transform<string, any>[]>(transforms: T) {
                return (fn: TransformHandler<string, number, T>) =>
                    transform<string, number, T>(transforms)(fn)
            }

            const handler = typeStrongTransform([transform1])((args) => args[0])
            expect(handler("1", {} as Context)).toBe(1)
        })
    })
})
