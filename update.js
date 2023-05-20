import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const dynamo = new DynamoDBDocumentClient(new DynamoDBClient({ region: "us-east-1" }));

export const handler = async (event) => {
    try {
        // Obtener el ID del cliente de los parámetros de ruta
        const id = event.pathParameters.id;
        // Parsear el cuerpo de la solicitud como objeto JSON
        const requestBody = JSON.parse(event.body);

        // Obtener los atributos y valores enviados en el cuerpo de la solicitud
        const updateExpression = "SET " + Object.keys(requestBody).map((key) => `#${key} = :${key}`).join(", ");
        
        // Construir el mapeo de nombres de atributos de expresión
        const expressionAttributeNames = Object.keys(requestBody).reduce((acc, key) => {
            acc[`#${key}`] = key;
            return acc;
        }, {});
        
        // Construir el mapeo de valores de atributo de expresión
        const expressionAttributeValues = Object.keys(requestBody).reduce((acc, key) => {
            acc[`:${key}`] = requestBody[key];
            return acc;
        }, {});

        await dynamo.send(new UpdateCommand({
            TableName: "Clientes",
            Key: { id: id },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues
        }));

        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Cliente actualizado correctamente" })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};
