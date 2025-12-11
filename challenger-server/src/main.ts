import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ensureUploadFolder } from './lib/config/create-upload-folder';
import * as dotenv from 'dotenv';


async function bootstrap() {
  dotenv.config({ path: '.env' });
  const app = await NestFactory.create(AppModule);

    ensureUploadFolder();

    const config = new DocumentBuilder()
    .setTitle('Test Integration Payments - Documentation')
    .setDescription('API TEST - Sistema de Integrações para Pagamentos')
    .setVersion('1.0')    
     // Define o esquema de autenticação para manager
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'manager' },
      'manager'
    )
    // Define o esquema de autenticação para store
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'store' },
      'store'
    )
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('doc', app, document, {
    swaggerOptions: {
      docExpansion: 'none',      
    } 
  });

  
  app.enableCors({
    origin: ['http://localhost:3000', 'https://meu-site.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'x-manager-id',
      'x-manager-next-sha256',
    ],    
    credentials: true,    
  });
  
  app.useGlobalFilters(new AllExceptionFilter()); //Filtro Global

  const port = Number(process.env.PORT) || 8000;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}
bootstrap();
