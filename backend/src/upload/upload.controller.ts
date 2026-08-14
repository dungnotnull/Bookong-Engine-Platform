import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Express } from 'express';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required or file type is not supported');
    }
    
    // Return the public URL to access the uploaded file
    const port = process.env.PORT || 3000;
    const fileUrl = `http://localhost:${port}/uploads/${file.filename}`;
    
    return {
      url: fileUrl,
    };
  }
}
