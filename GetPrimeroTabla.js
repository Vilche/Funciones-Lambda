import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));

export const handler = async (event) => {
    try {
        // Realizar una operación de escaneo para obtener el primer elemento de la tabla
        const scanResult = await dynamo.send(new ScanCommand({
            TableName: "Clientes",
            Limit: 1
        }));

        if (scanResult.Items.length > 0) {
            const primerCliente = scanResult.Items[0];
            return {
                statusCode: 200,
                body: JSON.stringify(primerCliente)
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "No se encontraron clientes" })
            };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};