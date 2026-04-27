export type Room = {
  id: string;
  name: string;
  capacity: number;
  floor: string;
  features: string[];
  icon: "users" | "presentation" | "video" | "briefcase";
  available: boolean;
  hoursUntilFree: number; // 0 quando disponível
};

export type TimeSlot = {
  time: string;
  available: boolean;
};

export type Reservation = {
  id: string;
  roomName: string;
  date: string;
  time: string;
  status: "confirmada" | "pendente";
};

export const rooms: Room[] = [
  {
    id: "1",
    name: "Sala 1",
    capacity: 6,
    floor: "1º andar",
    features: ["Projetor", "Quadro branco", "Wi-Fi"],
    icon: "users",
    available: true,
    hoursUntilFree: 0,
  },
  {
    id: "2",
    name: "Sala 2",
    capacity: 10,
    floor: "2º andar",
    features: ["TV 55\"", "Videoconferência", "Wi-Fi"],
    icon: "video",
    available: false,
    hoursUntilFree: 2,
  },
  {
    id: "3",
    name: "Sala 3",
    capacity: 4,
    floor: "3º andar",
    features: ["Isolamento acústico", "Mesa redonda"],
    icon: "briefcase",
    available: true,
    hoursUntilFree: 0,
  },
  {
    id: "4",
    name: "Sala 4",
    capacity: 12,
    floor: "Térreo",
    features: ["Projetor 4K", "Microfone", "Som"],
    icon: "presentation",
    available: false,
    hoursUntilFree: 1,
  },
];

export const timeSlots: TimeSlot[] = [
  { time: "08:00 - 09:00", available: true },
  { time: "09:00 - 10:00", available: false },
  { time: "10:00 - 11:00", available: true },
  { time: "11:00 - 12:00", available: true },
  { time: "13:00 - 14:00", available: false },
  { time: "14:00 - 15:00", available: true },
  { time: "15:00 - 16:00", available: true },
  { time: "16:00 - 17:00", available: true },
  { time: "17:00 - 18:00", available: false },
  { time: "18:00 - 19:00", available: true },
];

export const myReservations: Reservation[] = [
  { id: "r1", roomName: "Sala 1", date: "Hoje", time: "10:00 - 11:00", status: "confirmada" },
  { id: "r2", roomName: "Sala 3", date: "Amanhã", time: "14:00 - 15:00", status: "confirmada" },
  { id: "r3", roomName: "Sala 4", date: "28 abr", time: "16:00 - 17:00", status: "pendente" },
];
