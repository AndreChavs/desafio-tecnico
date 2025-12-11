import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<any>) {}

  transform(value: any, metadata: ArgumentMetadata) {

    // Se for parâmetro, normalmente vem string. Vamos converter.
    if (metadata.type === 'param') {
      const numericId = Number(value.id);
      value.id = isNaN(numericId) ? value.id : numericId;
    }

    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException(result.error.issues);
    }

    return result.data;
  }
}