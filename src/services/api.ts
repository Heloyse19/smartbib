const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

let authToken: string | null = null;

export function setToken(token: string | null) {
  authToken = token;
}

export function getToken(): string | null {
  return authToken;
}

async function request(path: string, options: RequestInit = {}): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Erro ${res.status}`);
  }

  return data;
}

export interface Sala {
  id: number;
  nome: string;
  capacidade: number;
  andar: number;
  recursos: string[];
  icon: string;
  status: "livre" | "reservada" | "ocupada";
}

export interface Reserva {
  id: number;
  salaId: number;
  roomName: string;
  date: string;
  time: string;
  status: string;
  horaInicio: string;
  horaFim: string;
}

export async function login(email: string, senha: string) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
  setToken(data.token);
  return data;
}

export async function register(email: string, matricula: string, senha: string) {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, matricula, senha }),
  });
  setToken(data.token);
  return data;
}

export async function getSalas(): Promise<Sala[]> {
  return request("/salas");
}

export async function createReserva(
  salaId: number,
  data: string,
  horaInicio: string,
  horaFim: string
) {
  return request("/reservas", {
    method: "POST",
    body: JSON.stringify({ salaId, data, horaInicio, horaFim }),
  });
}

export async function getReservas(): Promise<Reserva[]> {
  return request("/reservas");
}

export async function cancelReserva(id: number) {
  return request(`/reservas/${id}`, { method: "DELETE" });
}

export async function ocuparReserva(id: number) {
  return request(`/reservas/${id}/ocupar`, { method: "POST" });
}

export function logout() {
  setToken(null);
}
