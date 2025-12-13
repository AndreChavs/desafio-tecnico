import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ZodValidationPipe } from '../common/zod.pipe';
import { IdParamSchema, PaymentSchema } from './schema/payment.schema';
import type { CreatePaymentDto, CreatePaymentTypeDto} from './dto/create-payment.dto';
import type { UpdatePaymentDto } from './dto/update-payment.dto';
import { CreatePaymentSwaggerDto, CreatePaymentTypeSchemaSwagger, IdParamType, PaymentResSwagger, PaymentTypeResSwagger, UpdatePaymentSwaggerDto} from './dto/create-payment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentTypeSchema } from './schema/payment-type.schema';
import { ResponsePaymentDto } from './dto/response-payment.dto';

@ApiTags('API Payment')
@Controller('api/payment')
export class PaymentController {
    constructor(private service: PaymentService) {}

    @Post('create')
    @HttpCode(HttpStatus.CREATED)   
    @ApiOperation({ summary: 'Create a new payment'})
    @ApiBody({type: CreatePaymentSwaggerDto})
    @ApiResponse({
        status: 201,
        description: 'Payment created successfully.',
        type: PaymentResSwagger,
    })
    public async createPayment(
        @Body(new ZodValidationPipe(PaymentSchema)) createdto: CreatePaymentDto,
    ) {
        return await this.service.create(createdto);
    }

    @Get('findAll')
    @ApiOperation({ summary: 'Lista de pagamentos'})
    @ApiResponse({
        status: 200,
        description: 'List of payments returned successfully.',
        type: PaymentResSwagger,
        isArray: true
    })    
    public async getPayments():Promise<{payments: ResponsePaymentDto[]}> {
        return await this.service.findAll();
    }

    @Get('find/:id')
    @UsePipes(new ZodValidationPipe(IdParamSchema))
    @ApiOperation({ summary: 'Buscar pagamento por ID' })
    @ApiParam({name:'id' , type: IdParamType})
    @ApiResponse({
        status: 200,
        description: 'Payment found successfully.',
        type: PaymentResSwagger
    })
    public async findOnePayment(@Param() params: { id: number }) {
        return await this.service.findOne(params.id);
    }

    @Put(':id')    
    @ApiOperation({ summary: 'Atualizar pagamento' })
    @ApiParam({name:'id' , type: IdParamType})
    @ApiBody({ type: UpdatePaymentSwaggerDto })
    @ApiResponse({
        status: 200,
        description: 'Updated successfully.',
        type: PaymentResSwagger
    })
    public async updatePayment(
        @Param(new ZodValidationPipe(IdParamSchema)) params: { id: number }, 
        @Body(new ZodValidationPipe(PaymentSchema)) updatedto: UpdatePaymentDto
    ) {
        return await this.service.update(params.id, updatedto);
    }

    @Delete(':id')
    @UsePipes(new ZodValidationPipe(IdParamSchema))
    @ApiOperation({ summary: 'Remover pagamento' })
    @ApiParam({name:'id' , type: IdParamType})
    @ApiResponse({ status: 200, description: 'Removed successfully.' })
    public async removePayment(@Param() params: { id: number }) {
        return await this.service.remove(params.id);
    }



    /////////TYPES DE PAGAMENTO/////////
    @Get('types') 
    @ApiOperation({ summary: 'Listar tipos de pagamento' })
    @ApiResponse({
        status: 200,
        type: PaymentTypeResSwagger,
        isArray: true
    })   
    public async getPaymentTypes() {
        return await this.service.getPaymentTypes();
    }

    @Post('types/create')
    @HttpCode(HttpStatus.CREATED)  
    @UsePipes(new ZodValidationPipe(CreatePaymentTypeSchema))
    @ApiOperation({ summary: 'Criar novo tipo de pagamento' })
    @ApiBody({ type: CreatePaymentTypeSchemaSwagger })
    @ApiResponse({
        status: 200,
        type: PaymentTypeResSwagger
    })
    public async createPaymentType(@Body() body: CreatePaymentTypeDto) {
        return await this.service.createPaymentType(body.name);
    }



    //////////File Upload//////////
    @Post('upload-receipt/:id')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const original = Buffer.from(file.originalname, "latin1").toString("utf8");
                // extrai a extensão de forma segura
                const ext = extname(original) || "." + file.mimetype.split("/")[1];

                // gera nome limpo
                const safeName = original
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "") // remove acentos
                    .replace(/[^a-zA-Z0-9.-]/g, "_"); // remove caracteres problemáticos

                const finalName = `${safeName}`;
                cb(null, finalName);
            }
        }),        
        limits:{ fileSize: 5 * 1024 * 1024 } // 5MB
    }))
    @ApiOperation({ summary: 'Upload de comprovante e criação de pagamento' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    })
    public async uploadReceipt(
        @Param() params: { id: number },
       @UploadedFile() file: Express.Multer.File, 
    ) {
        if (!file) throw new BadRequestException('Comprovante obrigatório nesse endpoint.');
        console.log({file, id:params.id}) 
        const receiptPath = `/uploads/${file.filename}`
        console.log(receiptPath)
        const id = Number(params.id)
        return await this.service.uploadFile(id, receiptPath)
    }
}
