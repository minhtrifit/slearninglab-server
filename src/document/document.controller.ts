import {
  Req,
  Res,
  Controller,
  Post,
  UseInterceptors,
  Body,
  UploadedFile,
  UploadedFiles,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import {
  FileInterceptor,
  FilesInterceptor,
  AnyFilesInterceptor,
} from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { storageConfig } from 'src/helpers/multer.config';
import { extname, join } from 'path';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storageConfig('document'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.pdf'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = 'wrong extenstion type';
          cb(null, false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  uploadDocument(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    const classId = req.headers.classid;
    if (file !== undefined && !req.fileValidationError) {
      console.log(classId);
      console.log(file.destination + '/' + file.filename);
      return true;
    }
    return false;
  }

  @Post('uploads')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: storageConfig('document'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.pdf'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = 'wrong extenstion type';
          cb(null, false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  uploadMultiDocument(
    @Req() req: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const classId = req.headers.classid;
    if (files.length !== 0 && !req.fileValidationError) {
      console.log(classId);
      files.map((file) => {
        console.log(file.destination + '/' + file.filename);
      });
      return true;
    }
    return false;
  }

  @Post('download')
  streamable(@Res({ passthrough: true }) response: Response) {
    const file = this.documentService.fileStream();
    return new StreamableFile(file);
  }
}
