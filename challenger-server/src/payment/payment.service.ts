import { BadRequestException, Injectable, NotFoundException, UploadedFile } from '@nestjs/common';
import { CreatePaymentDto, CreatePaymentTypeDto } from './dto/create-payment.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { startOfDay, endOfDay } from 'date-fns';


@Injectable()
export class PaymentService {
    constructor(private prisma:PrismaService) {}

    public async create(createdto: CreatePaymentDto){
        // Lógica para criar um pagamento        
        try {
            const {amount, date, description, paymentTypeId, receiptPath} = createdto;
            const dateObj = new Date(createdto.date);
            if (isNaN(dateObj.getTime())) {
                throw new BadRequestException('Data inválida.');
            }

            // Verifica duplicidade de pagamento no mesmo dia, tipo, valor e descrição
            const start = startOfDay(dateObj);
            const end = endOfDay(dateObj);

            const existingPayment = await this.prisma.payment.findUnique({
                where:{unique_payment_constraint:{
                    amount, date, description, paymentTypeId
                }}
            })

            if (existingPayment) {
                throw new BadRequestException('Pagamento duplicado para o mesmo dia, tipo, valor e descrição.');
            }

            const pt = await this.prisma.paymentType.findUnique({ where: { id: createdto.paymentTypeId }});
            if (!pt) throw new BadRequestException('Tipo de pagamento inválido.');

            await this.prisma.payment.create({
                data:{
                    date: createdto.date,
                    description: createdto.description,
                    amount: createdto.amount,
                    paymentTypeId: createdto.paymentTypeId
                },
            });
            
            return {message: 'Payment criado com sucesso!'}            
        } catch (error) {
            console.error('Erro ao criar pagamento.'+ error.message)
            throw error
        }

    }

    public async findAll(){
        // Lógica para listar todos os pagamentos
        try {
            return {payments: await this.prisma.payment.findMany()} ;
            
        } catch (error) {
            throw new BadRequestException('Erro ao listar pagamentos.');  
        }
    }
    
    public async findOne(id: number){
        // Lógica para encontrar um pagamento pelo ID
        try {
            const payment = await this.prisma.payment.findUnique({
                where: { id },include:{paymentType:true}
            });
            return {payment}            
        } catch (error) {
            throw new BadRequestException('Erro ao encontrar pagamento.');
        }
    }

    public async update(id: number, updatedto: UpdatePaymentDto){
        // Lógica para atualizar um pagamento pelo ID
        try {
            console.log({id, updatedto})
            const payment = await this.prisma.payment.findUnique({ where: { id }});
            if (!payment) throw new NotFoundException('Pagamento não encontrado.');
            const {amount, date, description, paymentTypeId, receiptPath} = updatedto;

            const existing = await this.prisma.payment.findUnique({
                where:{unique_payment_constraint:{
                    amount, date, paymentTypeId, description
                }}
            });

            if (existing) {
                throw new BadRequestException('Atualização criaria pagamento duplicado.');
            }

            return await this.prisma.payment.update({
                where: { id },
                data: updatedto,
            });            
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    public async remove(id: number){
        // Lógica para remover um pagamento pelo ID
        try {
            return await this.prisma.payment.delete({
                where: { id },
            });
            
        } catch (error) {
            throw new BadRequestException('Erro ao remover pagamento.');
        }
    }




    /////////TYPES DE PAGAMENTO/////////
    public async getPaymentTypes(){
        try {            
            return {paymentType: await this.prisma.paymentType.findMany({orderBy:{name:'asc'}})} ;
        } catch (error) {
            throw new BadRequestException('Erro ao listar tipos de pagamento.'+ error);
        }
    }

    public async createPaymentType(name: string){
        try {
            await this.prisma.paymentType.create({
                data: {name: name}
            });
            return {message: `Typo de pagamento criado com sucesso! : '${name}'`}
        } catch (error) {
            if (error.code === 'P2002') { // unique constraint
                throw new BadRequestException('Tipo de pagamento já existe.');
            }
            throw error;
        }
    }


    public async uploadFile(id:number, path: string){
        try {
            await this.prisma.payment.update({
                where:{id},
                data:{ receiptPath:path }
            })
            return {message: `O arquivo foi salvo em: ${path}`}
        } catch (error) {
            throw new BadRequestException('Falha no armazenamento do arquivo');
        }
    }


}
