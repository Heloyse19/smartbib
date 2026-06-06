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
    console.log('[API] Token sendo enviado:', authToken.substring(0, 20) + '...');
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(`[API] Erro ${res.status} em ${path}:`, data);
    throw new Error(data.error || `Erro ${res.status}`);
  }
  console.log(`[API] Sucesso ${path}:`, data);

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

export interface RoomSlot {
  inicio: string;
  fim: string;
  label: string;
  available: boolean;
}

export async function getRoomSlots(salaId: number, data: string): Promise<RoomSlot[]> {
  return request(`/salas/${salaId}/slots?data=${encodeURIComponent(data)}`);
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

// Excluir uma reserva permanentemente (histórico)
export async function deletarReservaPermanentemente(id: number) {
  return request(`/reservas/${id}/permanent`, { method: "DELETE" });
}

// Limpar todo o histórico (remove todas as reservas finalizadas)
export async function limparHistorico() {
  return request("/reservas/historico/limpar", { method: "DELETE" });
}

export function logout() {
  setToken(null);
}