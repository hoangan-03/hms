import { Patient } from "@/entities/patient.entity";
import { Doctor } from "@/entities/doctor.entity";
import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(
    user: Patient | Doctor,
    done: (err: Error | null, id?: Patient | Doctor) => void
  ): void {
    delete user.password;
    done(null, user);
  }

  deserializeUser(
    payload: unknown,
    done: (err: Error | null, payload?: unknown) => void
  ): void {
    done(null, payload);
  }
}
