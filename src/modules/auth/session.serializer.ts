import { Patient } from '@/entities/patient.entity';
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';


@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(
    user: Patient,
    done: (err: Error | null, id?: Patient) => void,
  ): void {
    delete user.password;
    done(null, user);
  }

  deserializeUser(
    payload: unknown,
    done: (err: Error | null, payload?: unknown) => void,
  ): void {
    done(null, payload);
  }
}