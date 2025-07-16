import { api } from "./api";

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

// Datos mock para pruebas
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "usuario@test.com",
    role: "user",
  },
  {
    id: "2",
    email: "admin@test.com",
    role: "admin",
  },
];

const MOCK_PASSWORDS: Record<string, string> = {
  "usuario@test.com": "password123",
  "admin@test.com": "admin123",
};

class AuthService {
  private readonly TOKEN_KEY = "auth_token";

  async login(credentials: LoginCredentials): Promise<{ user: User }> {
    try {
      const response = await api.post("/users/authenticate", credentials);
      const user: User = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      return { user };
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        throw new Error("Credenciales inválidas");
      }
      throw new Error("Error al iniciar sesión");
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      // Simulación de delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verificar si el email ya está registrado
      if (MOCK_USERS.some((u) => u.email === credentials.email)) {
        throw new Error("El email ya está registrado");
      }

      const newUser: User = {
        id: `${MOCK_USERS.length + 1}`,
        email: credentials.email,
        role: "user",
      };

      MOCK_USERS.push(newUser);
      MOCK_PASSWORDS[credentials.email] = credentials.password;

      const token = `mock-token-${Math.random()}`;
      this.setToken(token);
      return { user: newUser, token };
    } catch (error) {
      throw new Error("Error al registrar usuario");
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
