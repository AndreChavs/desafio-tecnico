import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, BadRequestException } from '@nestjs/common';
import * as request from 'supertest';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Decimal } from '@prisma/client/runtime/client';


beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('PaymentController – integração', () => {
    let app: INestApplication;
    let service: PaymentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers:[PaymentController],
            providers:[
                {
                    provide:PaymentService,
                    useValue:{
                        create: jest.fn(),
                        findAll: jest.fn(),
                        createPaymentType: jest.fn(),
                    }
                }
            ]
        }).compile()
        app = module.createNestApplication();
        await app.init();

        service = module.get(PaymentService);
    });

    // PAYLOAD VÁLIDO
    it('POST /payment/create → deve criar pagamento', async () => {
        jest.spyOn(service, 'create').mockResolvedValue({
        message: 'Payment criado com sucesso!',
        });

        const payload = {
        date: '2025-01-15',
        paymentTypeId: 1,
        description: 'Pagamento de taxa',
        amount: 150,
        receiptPath: null,
        };

        const response = await request(app.getHttpServer())
        .post('/api/payment/create')
        .send(payload)
        .expect(HttpStatus.CREATED);

        expect(response.body).toEqual({
        message: 'Payment criado com sucesso!',
        });

        expect(service.create).toHaveBeenCalledTimes(1);
    });

    // PAYLOAD INVÁLIDO (ZOD)
    it('POST /payment/create → deve rejeitar payload inválido', async () => {
        const invalidPayload = {
        date: 'data_errada',
        amount: 'cem',
        };

        const response = await request(app.getHttpServer())
        .post('/api/payment/create')
        .send(invalidPayload)
        .expect(HttpStatus.BAD_REQUEST);

        expect(service.create).not.toHaveBeenCalled();
    });

    //FindAll()
    it('GET /payment/findAll → deve retornar lista de pagamentos', async () => {
         const mockPayments = [
            {
            id: 1,
            amount: '150',
            description: 'Pagamento de taxa',
            date: '2025-01-15T00:00:00.000Z',
            paymentTypeId: 1,
            receiptPath: null,
            createdAt: '2025-01-15T10:00:00.000Z',
            updatedAt: '2025-01-15T10:00:00.000Z',
            },
            {
            id: 2,
            amount: '300',
            description: 'Pagamento de taxa',
            date: '2025-11-25T00:00:00.000Z',
            paymentTypeId: 2,
            receiptPath: null,
            createdAt: '2025-11-25T10:00:00.000Z',
            updatedAt: '2025-11-25T10:00:00.000Z',
            },
        ];

        jest.spyOn(service, 'findAll').mockResolvedValue({
            payments: mockPayments,
        });

        const response = await request(app.getHttpServer())
            .get('/api/payment/findAll')
            .expect(HttpStatus.OK);

        expect(response.body).toEqual({
            payments: mockPayments,
        });

        expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    // POST /payment/types/create
    it('POST /payment/types/create → deve criar um tipo de pagamento', async () => {
        const payload = { name: 'PIX' };

        jest.spyOn(service, 'createPaymentType').mockResolvedValue({
            message: "Typo de pagamento criado com sucesso! : 'PIX'",
        });

        const response = await request(app.getHttpServer())
            .post('/api/payment/types/create')
            .send(payload)
            .expect(HttpStatus.CREATED); // 201, já que é criação

        expect(response.body).toEqual({
            message: "Typo de pagamento criado com sucesso! : 'PIX'",
        });

        expect(service.createPaymentType).toHaveBeenCalledTimes(1);
        expect(service.createPaymentType).toHaveBeenCalledWith('PIX');
    });

  it('POST /payment/types/create → deve rejeitar payload inválido', async () => {
    const invalidPayload = { nome: 'PIX' }; // chave errada / inválida

    const response = await request(app.getHttpServer())
      .post('/api/payment/types/create')
      .send(invalidPayload)
      .expect(HttpStatus.BAD_REQUEST);

    expect(service.createPaymentType).not.toHaveBeenCalled();
  });
})