import { resolve } from 'path';
import { generateApi } from 'swagger-typescript-api';

generateApi({
    name: 'Api.ts', // Имя сгенерированного файла
    output: resolve(process.cwd(), './src/api'), // Путь для сгенерированных файлов
    input: resolve(process.cwd(), './swagger-4.yaml'), // Путь к вашему Swagger файлу
    httpClientType: 'axios', // Указываем, что хотим использовать axios
});