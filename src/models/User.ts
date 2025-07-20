// models/User.ts
export class User {
  id!: number;
  name!: string;
  email!: string;
  role!: number; // 1: Admin, 2: User
  token?: string; // opcional, si se maneja autenticación basada en token
  // …cualquier otro campo

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }

  // puedes añadir métodos de instancia aquí
}
