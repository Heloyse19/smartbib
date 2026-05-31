export type Room = {
  id: number;
  name: string;
  capacity: number;
  floor: string;
  features: string[];
  icon: "users" | "presentation" | "video" | "briefcase";
  available: boolean;
  hoursUntilFree?: number;
};

export type TimeSlot = {
  time: string;
  available: boolean;
};

export type Reservation = {
  id: number;
  roomName: string;
  date: string;
  time: string;
  status: "confirmada" | "pendente";
};

export const rooms: Room[] = [
  {
    id: 1,
    name: "Sala 1",
    capacity: 6,
    floor: "1º andar",
    features: ["Wi-Fi", "Projetor"],
    icon: "users",
    available: true,
  },
  {
    id: 2,
    name: "Sala 2",
    capacity: 10,
    floor: "2º andar",
    features: ["Wi-Fi", "Quadro branco"],
    icon: "presentation",
    available: false,
    hoursUntilFree: 2,
  },
  {
    id: 3,
    name: "Sala 3",
    capacity: 4,
    floor: "3º andar",
    features: ["Wi-Fi", "TV"],
    icon: "video",
    available: true,
  },
  {
    id: 4,
    name: "Sala 4",
    capacity: 12,
    floor: "Térreo",
    features: ["Wi-Fi", "Projetor", "Ar-condicionado"],
    icon: "briefcase",
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
  { id: 1, roomName: "Sala 1", date: "Hoje", time: "10:00 - 11:00", status: "confirmada" },
  { id: 2, roomName: "Sala 3", date: "Amanhã", time: "14:00 - 15:00", status: "confirmada" },
  { id: 3, roomName: "Sala 4", date: "28 abr", time: "16:00 - 17:00", status: "pendente" },
];
