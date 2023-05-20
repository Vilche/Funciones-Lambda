import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

// Crear una instancia del cliente de DynamoDB
const dynamo = new DynamoDBDocumentClient(new DynamoDBClient({ region: "us-east-1" }));

export const handler = async (event) => {
    try {
        // Obtener el ID del cliente de los parámetros de ruta
        const id = event.pathParameters.id;

        // Enviar el comando de eliminación a DynamoDB
        await dynamo.send(new DeleteCommand({
            TableName: "Clientes",
            Key: { id: id }
        }));

        // Retornar una respuesta exitosa
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Cliente eliminado correctamente" })
        };
    } catch (error) {
        console.error(error);

        // Retornar una respuesta de error con el mensaje de error
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};
