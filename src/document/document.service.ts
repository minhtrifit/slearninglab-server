import { Injectable } from '@nestjs/common';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentService {
  constructor() {
    //
  }

  imageBuffer() {
    return readFileSync(join(process.cwd(), 'notiz.png'));
  }

  imageStream() {
    return createReadStream(join(process.cwd(), 'notiz.png'));
  }

  fileBuffer() {
    return readFileSync(join(process.cwd(), 'package.json'));
  }

  fileStream() {
    return createReadStream(join(process.cwd(), './upload/document/test.pdf'));
  }
}
