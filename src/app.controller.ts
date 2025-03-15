import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from '@/app.service';
import { JWTAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/user.decorator';
import { Patient } from '@/entities/patient.entity';
import { Doctor } from '@/entities/doctor.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


}