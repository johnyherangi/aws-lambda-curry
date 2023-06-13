import { APIGatewayProxyEvent } from "aws-lambda"

export function isApiGatewayProxyEvent(
    event: APIGatewayProxyEvent | undefined,
): event is APIGatewayProxyEvent {
    return (event as APIGatewayProxyEvent).httpMethod !== undefined
}
