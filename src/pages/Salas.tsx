import { useNavigate } from "react-router-dom";
import { Users, MapPin, ChevronRight, Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MobileFrame } from "@/components/MobileFrame";
import { rooms } from "@/data/mockData";

const Salas = () => {
  const navigate = useNavigate();

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
            <button className="w-11 h-11 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </button>
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
            <span className="text-xs text-muted-foreground">{rooms.length} resultados</span>
          </div>

          {rooms.map((room) => (
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
                <div className="flex flex-wrap gap-1 mt-2">
                  {room.features.slice(0, 2).map((f) => (
                    <Badge key={f} variant="secondary" className="text-[10px] font-normal rounded-full">
                      {f}
                    </Badge>
                  ))}
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
