export type Room = {
  id: string;
  name: string;
  capacity: number;
  floor: string;
  features: string[];
  image: string;
};

export type TimeSlot = {
  time: string;
  available: boolean;
};

export const rooms: Room[] = [
  {
    id: "1",
    name: "Sala Acadêmica",
    capacity: 6,
    floor: "1º andar",
    features: ["Projetor", "Quadro branco", "Wi-Fi"],
    image: "🪑",
  },
  {
    id: "2",
    name: "Sala Colaborativa",
    capacity: 10,
    floor: "2º andar",
    features: ["TV 55\"", "Videoconferência", "Wi-Fi"],
    image: "💻",
  },
  {
    id: "3",
    name: "Sala Silenciosa",
    capacity: 4,
    floor: "3º andar",
    features: ["Isolamento acústico", "Mesa redonda"],
    image: "📚",
  },
  {
    id: "4",
    name: "Sala de Apresentações",
    capacity: 12,
    floor: "Térreo",
    features: ["Projetor 4K", "Microfone", "Som"],
    image: "🎤",
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
