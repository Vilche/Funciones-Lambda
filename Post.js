import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";


const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));

export const handler = async (event) => {
    try {
        const cliente = JSON.parse(event.body);

        const nuevoCliente = {
            ...cliente,
            id: randomUUID(),
        };

        await dynamo.send(new PutCommand({
            TableName: "Clientes",
            Item: nuevoCliente
        }));

        return {
            statusCode: 201,
            body: JSON.stringify(nuevoCliente)
        }
    } catch (error) {
        console.error(error);
        return {
            statudCode: 500,
            body: JSON.stringify({ message: error.message })
        };

    }
}