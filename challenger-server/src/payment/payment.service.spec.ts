import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PrismaService } from 'src/lib/prisma/prisma.service'; // Importe o service real para tipagem
import { CreatePaymentDto } from './dto/create-payment.dto';

describe('PaymentService', () => {
  let service: PaymentService;
  let prismaService: PrismaService; // Opcional: para acessar o mock depois, se precisar

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        // Adicione o PrismaService como um provider, mas use um mock/stub
        {
          provide: PrismaService,
          useValue: {
            // Aqui você pode mockar métodos específicos que o PaymentService usa.
            // Exemplo: se o PaymentService usa prisma.payment.findMany, você moca isso aqui:
            payment: {
              findMany: jest.fn().mockResolvedValue([]),
              // Adicione outros métodos que você precisa mockar
            },
            // Se o PaymentService usar métodos que você criou no PrismaService
            // (ex: myCustomQuery): jest.fn().mockResolvedValue(someValue)
          },
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    prismaService = module.get<PrismaService>(PrismaService); // Opcional
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ADICIONE MAIS TESTES AQUI
  

  
});
