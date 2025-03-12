import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { Repository } from "typeorm";
import { Patient } from "@/entities/patient.entity";

@ValidatorConstraint({ name: "isUserNameAlreadyExist", async: true })
@Injectable()
export class IsUserNameAlreadyExist implements ValidatorConstraintInterface {
  private readonly logger = new Logger(IsUserNameAlreadyExist.name);

  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>
  ) {}

  async validate(username: string): Promise<boolean> {
    try {
      const patient = await this.patientRepository.findOne({
        where: { username },
      });
      return patient === null || patient === undefined;
    } catch (error) {
      this.logger.error(
        `Error validating username: ${(error as any).message}`,
        (error as any).stack
      );
      return false;
    }
  }
  defaultMessage(): string {
    return "The username $value is already registered.";
  }
}
