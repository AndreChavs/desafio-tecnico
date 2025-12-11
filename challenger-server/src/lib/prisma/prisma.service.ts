import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';



@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    this.logger.log('Tentando conectar ao banco...');
    await this.$connect();
    this.logger.log('Conexão com o MySQL estabelecida com sucesso.');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Conexão encerrada.');
  }
}