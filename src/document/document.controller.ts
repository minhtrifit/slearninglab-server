import {
  Get,
  HttpCode,
  Header,
  Req,
  Res,
  Controller,
  Post,
  UseInterceptors,
  Body,
  UploadedFile,
  UploadedFiles,
  StreamableFile,
  UsePipes,
  UseGuards,
  ValidationPipe,
  RawBodyRequest,
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
import { AccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { HasRoles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/models/role.enum';
import { extname, join } from 'path';
import { Request } from 'express';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @HasRoles(Role.Teacher)
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
  async uploadDocument(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const classId = req.headers.classid;
    if (file !== undefined && !req.fileValidationError) {
      console.log(classId);
      console.log(file.destination + '/' + file.filename);
      await this.documentService.saveDocument(classId, file.filename);
      return true;
    }
    return false;
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @HasRoles(Role.Teacher)
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
  async uploadMultiDocument(
    @Req() req: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const classId = req.headers.classid;
    if (files.length !== 0 && !req.fileValidationError) {
      console.log(classId);
      files.map(async (file) => {
        // console.log(file.destination + '/' + file.filename);
        await this.documentService.saveDocument(classId, file.filename);
      });
      return true;
    }
    return false;
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Get('download')
  downloadDocument(@Req() req: Request, @Res() res) {
    // console.log(req.headers.classid, req.headers.filename);
    // res.download(`./upload/document/${req.headers.filename}`);
    this.documentService.downloadDocument(
      res,
      req.headers.classid,
      req.headers.filename,
    );
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Get('getDocumentByClassId')
  getDocumentByClassId(@Req() req: Request) {
    const classId: any = req.query.classId;
    return this.documentService.getDocumentByClassId(classId);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @HasRoles(Role.Teacher)
  @Post('delete')
  deleteDocument(@Req() req: RawBodyRequest<Request>) {
    const documentId: string = req.body.body;
    return this.documentService.deleteDocument(documentId);
  }
}
