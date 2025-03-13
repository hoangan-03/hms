import { Role } from "../enums/role.enum";

export interface JwtPayload {
  sub: string;               
  username?: string;     
  iat?: number;         
  exp?: number;   
  role?: Role; 
}