import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../entities/index';

@Module({
  imports: [
    MulterModule.register({
      // dest: './files',
    }),
    TypeOrmModule.forFeature([Document]),
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
