import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import {useContainer} from "class-validator";
import * as compression from 'compression';
import { GlobalExceptionFilter } from "./exception-filters/global-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService);
  const port = configService.get("PORT") || 3000;

  const sessionSecret = configService.get("SESSION_SECRET") || "my-secret";
  app.useGlobalFilters(new GlobalExceptionFilter(configService));
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000 * 60 * 24,
        secure: process.env.NODE_ENV === "production",
      },
    })
  );
  
  app.use(cookieParser(sessionSecret));
  app.use(compression());
  app.enableCors();

  app.setGlobalPrefix("api");

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  const config = new DocumentBuilder()
    .setTitle("HMS")
    .setDescription("API for HMS")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/swagger-docs", app, document);

  
  await app.listen(port);
}
bootstrap();