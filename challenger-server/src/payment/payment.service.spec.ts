import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { PaymentSchema } from './schema/payment.schema';
import { BadRequestException } from '@nestjs/common';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('PaymentService', () => {
  let service: PaymentService;

  const prismaMock = {
    payment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      
    },
    paymentType: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: PrismaService, // CORRETO
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // -------------------------------------------------------
  // Dados para testes
  // -------------------------------------------------------
  const validPayload = {
    date: '2025-01-15',
    paymentTypeId: 1,
    description: 'Pagamento de taxa',
    amount: 150,
    receiptPath: null,
  };

  const validDto = PaymentSchema.parse(validPayload);

  // -------------------------------------------------------
  // TESTE 1 — criação bem-sucedida
  // -------------------------------------------------------
  it('deve criar um pagamento com sucesso', async () => {
    prismaMock.payment.findUnique.mockResolvedValue(null); 
    prismaMock.paymentType.findUnique.mockResolvedValue({ id: 1 });
    prismaMock.payment.create.mockResolvedValue({ id: 123 });

    const result = await service.create(validDto);

    expect(prismaMock.payment.findUnique).toHaveBeenCalled();
    expect(prismaMock.paymentType.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(prismaMock.payment.create).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Payment criado com sucesso!' });
  });

  // -------------------------------------------------------
  // TESTE 2 — data inválida
  // -------------------------------------------------------
  it('deve lançar erro ao receber data inválida', async () => {
    const invalidDto = {
      ...validDto,
      date: 'data_errada',
    };

    await expect(service.create(invalidDto as any)).rejects.toThrow(BadRequestException);
  });

  // -------------------------------------------------------
  // TESTE 3 — pagamento duplicado
  // -------------------------------------------------------
  it('deve lançar erro se já existir pagamento igual no dia', async () => {
    prismaMock.payment.findUnique.mockResolvedValue({ id: 999 });

    await expect(service.create(validDto)).rejects.toThrow(
      'Pagamento duplicado para o mesmo dia, tipo, valor e descrição.',
    );
  });

  // -------------------------------------------------------
  // TESTE 4 — tipo de pagamento inexistente
  // -------------------------------------------------------
  it('deve lançar erro se o tipo de pagamento for inválido', async () => {
    prismaMock.payment.findUnique.mockResolvedValue(null);
    prismaMock.paymentType.findUnique.mockResolvedValue(null);

    await expect(service.create(validDto)).rejects.toThrow(
      'Tipo de pagamento inválido.',
    );
  });

  ////////// Teste FindOne ///////////
  it('deve retornar um pagamento pelo ID', async () => {
    const mockPayment = {
      id: 42,
      amount: 100,
      paymentType: { id: 1, name: 'PIX' },
    };

    prismaMock.payment.findUnique.mockResolvedValue(mockPayment);

    const result = await service.findOne(42);

    expect(prismaMock.payment.findUnique).toHaveBeenCalledWith({
      where: { id: 42 },
      include: { paymentType: true },
    });

    expect(result).toEqual({ payment: mockPayment });
  });

  ////////// Teste FindAll ///////////
  it('deve listar todos os pagamentos', async () => {
    const mockPayments = [
      { id: 1, amount: 200 },
      { id: 2, amount: 500 },
    ];

    prismaMock.payment.findMany.mockResolvedValue(mockPayments);

    const result = await service.findAll();

    expect(prismaMock.payment.findMany).toHaveBeenCalled();
    expect(result).toEqual({ payments: mockPayments });
  });

  it('deve lançar BadRequestException ao falhar ao listar', async () => {
    prismaMock.payment.findMany.mockRejectedValue(new Error('DB error'));

    await expect(service.findAll()).rejects.toThrow(
      BadRequestException,
    );
  });

  ////////Updadete payment//////
  it('deve atualizar o pagamento com sucesso', async () => {
    const existingPayment = {
      id: 10,
      amount: 100,
      description: 'Antigo',
      paymentTypeId: 1,
    };

    const updateDto = {
      amount: 200,
      description: 'Atualizado',
      paymentTypeId: 1,
    };

    prismaMock.payment.findUnique
      .mockResolvedValueOnce(existingPayment) // pagamento existe
      .mockResolvedValueOnce(null);           // não cria duplicata

    prismaMock.payment.update.mockResolvedValue({
      id: 10,
      ...updateDto,
    });

    const result = await service.update(10, updateDto as any);

    expect(prismaMock.payment.findUnique).toHaveBeenCalledTimes(2);
    expect(prismaMock.payment.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: updateDto,
    });

    expect(result).toEqual({
      id: 10,
      ...updateDto,
    });
  });

  ///////////////////Create Type Payment /////////////
  it('deve criar um tipo de pagamento com sucesso', async () => {
    prismaMock.paymentType.create.mockResolvedValue({ id: 1, name: 'PIX' });

    const result = await service.createPaymentType('PIX');

    expect(prismaMock.paymentType.create).toHaveBeenCalledWith({
      data: { name: 'PIX' },
    });

    expect(result).toEqual({
      message: "Typo de pagamento criado com sucesso! : 'PIX'",
    });
  });

  //tipo duplicado (P2002)
  it('deve lançar erro se o tipo de pagamento já existir', async () => {
    prismaMock.paymentType.create.mockRejectedValue({
      code: 'P2002',
    });

    await expect(service.createPaymentType('PIX')).rejects.toThrow(
      'Tipo de pagamento já existe.',
    );
  });

  ///////////Upload File /////////////
  it('deve salvar o caminho do arquivo no pagamento', async () => {
    prismaMock.payment.update.mockResolvedValue({
      id: 10,
      receiptPath: '/uploads/comprovante.png',
    });

    const result = await service.uploadFile(10, '/uploads/comprovante.png');

    expect(prismaMock.payment.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { receiptPath: '/uploads/comprovante.png' },
    });

    expect(result).toEqual({
      message: 'O arquivo foi salvo em: /uploads/comprovante.png',
    });
  });

  //Falha no armazenamento
  it('deve lançar erro se falhar ao salvar o arquivo', async () => {
    prismaMock.payment.update.mockRejectedValue(new Error('DB error'));

    await expect(
      service.uploadFile(10, '/uploads/erro.png'),
    ).rejects.toThrow('Falha no armazenamento do arquivo');
  });

});