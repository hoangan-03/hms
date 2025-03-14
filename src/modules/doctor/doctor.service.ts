import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOneOptions } from "typeorm";
import { Doctor } from "@/entities/doctor.entity";

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>
  ) {}

  async getOne(options: FindOneOptions<Doctor>): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne(options);
    if (!doctor) {
      const identifier = options.where
        ? Object.entries(options.where)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
        : "unknown";

      throw new NotFoundException(`There isn't any doctor with ${identifier}`);
    }
    return doctor;
  }

}
