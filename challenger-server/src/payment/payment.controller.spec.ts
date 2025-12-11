import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';

describe('PaymentsController - uploadReceipt', () => {
  let controller: PaymentController;
  let service: PaymentService;

  const mockService = {
    uploadFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    service = module.get<PaymentService>(PaymentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================
  // 1. NÃO ENVIOU ARQUIVO → BAD REQUEST
  // ============================================================
  it('deve lançar BadRequestException quando nenhum arquivo for enviado', async () => {
    await expect(
      controller.uploadReceipt({ id: 1 }, null)
    ).rejects.toThrow(BadRequestException);

    expect(service.uploadFile).not.toHaveBeenCalled();
  });

  // ============================================================
  // 2. ENVIOU ARQUIVO → chama service.uploadFile
  // ============================================================
  it('deve chamar service.uploadFile corretamente', async () => {
    const fakeFile = {
      filename: 'comprovante_teste.png',
    } as Express.Multer.File;

    mockService.uploadFile.mockResolvedValue({ ok: true });

    const result = await controller.uploadReceipt(
      { id: 42 },
      fakeFile
    );

    expect(service.uploadFile).toHaveBeenCalledWith(
      42,
      `/uploads/comprovante_teste.png`,
    );

    expect(result).toEqual({ ok: true });
  });

  // ============================================================
  // 3. deve retornar o valor retornado pelo service
  // ============================================================
  it('deve retornar o valor do service', async () => {
    const fakeFile = {
      filename: 'abc.pdf',
    } as Express.Multer.File;

    const payload = { success: true, path: '/uploads/abc.pdf' };
    mockService.uploadFile.mockResolvedValue(payload);

    const response = await controller.uploadReceipt(
      { id: 99 },
      fakeFile
    );

    expect(response).toEqual(payload);
  });
});