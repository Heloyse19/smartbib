import { useNavigate } from "react-router-dom";
import { Users, MapPin, ChevronRight, Search, User, LogOut, CalendarCheck, Clock, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileFrame } from "@/components/MobileFrame";
import { rooms, myReservations } from "@/data/mockData";
import { toast } from "sonner";

const Salas = () => {
  const navigate = useNavigate();

  const sortedRooms = [...rooms].sort((a, b) => Number(a.id) - Number(b.id));

  const handleManageReservations = () => {
    const list = myReservations
      .map((r) => `${r.roomName} • ${r.date} ${r.time}`)
      .join("\n");
    toast("Suas reservas", { description: list });
  };

  const handleLogout = () => {
    toast.success("Você saiu da conta");
    navigate("/");
  };

  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col bg-background overflow-hidden">
        {/* Header */}
        <div className="gradient-hero px-6 pt-12 pb-8 text-primary-foreground rounded-b-[2rem]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-primary-foreground/70">Olá, Estudante 👋</p>
              <h1 className="text-2xl font-bold">Encontre uma sala</h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Menu do usuário"
                  className="w-11 h-11 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition"
                >
                  <User className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleManageReservations}>
                  <CalendarCheck className="w-4 h-4 mr-2" />
                  Gerenciar reservas
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar sala..."
              className="h-12 pl-12 rounded-2xl bg-white text-foreground border-0"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-foreground">Salas disponíveis</h2>
            <span className="text-xs text-muted-foreground">{sortedRooms.length} resultados</span>
          </div>

          {sortedRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => navigate(`/reservar/${room.id}`)}
              className="w-full text-left bg-card rounded-3xl p-4 shadow-card flex items-center gap-4 hover:scale-[0.98] transition-transform"
            >
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-3xl shrink-0">
                {room.image}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground truncate">{room.name}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {room.capacity}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {room.floor}
                  </span>
                </div>
                <div className="mt-2">
                  {room.available ? (
                    <Badge
                      className="rounded-full text-[10px] font-medium bg-success/15 text-success hover:bg-success/15 border-0"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Disponível
                    </Badge>
                  ) : (
                    <Badge
                      className="rounded-full text-[10px] font-medium bg-warning/15 text-warning hover:bg-warning/15 border-0"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Livre em {room.hoursUntilFree}h
                    </Badge>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </MobileFrame>
  );
};

export default Salas;
