const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({ region: 'us-east-1' });

const signedS3URL = async (event) => {
    try {
    // Tomamos "filename" de los query params
    const filename = event.queryStringParameters.filename;

    // Creamos el comando para PutObject
    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET,
        Key: `upload/${filename}`,
      // Opcional, si quieres restringir el contentType
      // ContentType: 'image/png'
    });

    // Generamos la URL firmada, válida por 300 segundos
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    // Retornamos la URL en el body
    return {
        statusCode: 200,
        body: JSON.stringify({ signedUrl }),
    };
    } catch (error) {
    console.error(error);
    return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
    };
    }
};

module.exports = {
    signedS3URL,
};