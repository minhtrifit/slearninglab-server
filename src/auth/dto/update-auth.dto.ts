import { PartialType } from '@nestjs/mapped-types';
import { registerAccountDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(registerAccountDto) {}
