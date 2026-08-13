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
    // Assumes the app is running on localhost:3000 for local dev
    const fileUrl = `http://localhost:3000/uploads/${file.filename}`;
    
    return {
      success: true,
      data: {
        url: fileUrl,
      }
    };
  }
}
