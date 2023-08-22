import { Injectable, BadRequestException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Repository, Not } from 'typeorm';

import { Document } from './entities/document.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async saveDocument(classId: string, fileName: string) {
    await this.documentRepository.save({
      classId: classId,
      fileName: fileName,
      dateUploaded: new Date(),
    });
  }

  async getDocumentByClassId(classId: string) {
    return await this.documentRepository.find({
      where: {
        classId: classId,
      },
    });
  }

  async downloadDocument(res: any, classId: any, fileName: any) {
    const checkFile = await this.documentRepository.find({
      where: {
        classId: classId,
        fileName: fileName,
      },
    });

    if (checkFile.length !== 0) res.download(`./upload/document/${fileName}`);
    else throw new BadRequestException('Document not found');
  }

  async deleteDocument(documentId: string) {
    try {
      await this.documentRepository
        .createQueryBuilder('exam')
        .delete()
        .from(Document)
        .where('id = :id', { id: documentId })
        .execute();

      return true;
    } catch (error) {
      throw new BadRequestException('Delete document failed');
    }
  }
}
