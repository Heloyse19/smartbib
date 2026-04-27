import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Users, MapPin, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MobileFrame } from "@/components/MobileFrame";
import { rooms, timeSlots } from "@/data/mockData";
import { toast } from "sonner";

const Reservar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const room = rooms.find((r) => r.id === id) ?? rooms[0];
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const handleConfirm = () => {
    if (!selectedSlot) return;
    setConfirmed(true);
    toast.success("Reserva confirmada!", {
      description: `${room.name} • ${selectedSlot}`,
    });
    setTimeout(() => navigate("/salas"), 1800);
  };

  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col bg-background overflow-hidden">
        {/* Header */}
        <div className="gradient-hero px-6 pt-12 pb-20 text-primary-foreground relative">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-full bg-white/15 backdrop-blur flex items-center justify-center mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur flex items-center justify-center text-4xl">
              {room.image}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{room.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-primary-foreground/80">
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {room.capacity} pessoas</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {room.floor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto -mt-12 bg-background rounded-t-[2.5rem] px-6 pt-6 pb-32">
          <div className="flex flex-wrap gap-2 mb-5">
            {room.features.map((f) => (
              <Badge key={f} variant="secondary" className="rounded-full font-normal">
                {f}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Calendar className="w-4 h-4" />
            <span className="capitalize">{today}</span>
          </div>

          <h2 className="font-bold text-lg text-foreground mb-3">Horários disponíveis</h2>
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map((slot) => {
              const isSelected = selectedSlot === slot.time;
              return (
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot.time)}
                  className={`
                    h-14 rounded-2xl text-sm font-semibold border-2 transition-all
                    ${!slot.available ? "bg-muted text-muted-foreground/50 border-transparent line-through cursor-not-allowed" : ""}
                    ${slot.available && !isSelected ? "bg-card text-foreground border-border hover:border-primary" : ""}
                    ${isSelected ? "gradient-primary text-primary-foreground border-transparent shadow-soft" : ""}
                  `}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-background border-t border-border">
          <Button
            onClick={handleConfirm}
            disabled={!selectedSlot || confirmed}
            className="w-full h-14 rounded-2xl gradient-primary text-primary-foreground font-semibold text-base shadow-soft hover:opacity-90 disabled:opacity-50"
          >
            {confirmed ? (
              <><Check className="mr-2 w-5 h-5" /> Reserva confirmada</>
            ) : selectedSlot ? (
              `Confirmar ${selectedSlot}`
            ) : (
              "Selecione um horário"
            )}
          </Button>
        </div>
      </div>
    </MobileFrame>
  );
};

export default Reservar;
