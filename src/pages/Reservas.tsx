import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MobileFrame } from "@/components/MobileFrame";
import { myReservations, type Reservation } from "@/data/mockData";
import { toast } from "sonner";

const Reservas = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Reservation[]>(myReservations);

  const handleCancel = (id: string) => {
    setItems((prev) => prev.filter((r) => r.id !== id));
    toast.success("Reserva cancelada");
  };

  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col bg-background overflow-hidden">
        {/* Header */}
        <div className="gradient-hero px-6 pt-12 pb-8 text-primary-foreground rounded-b-[2rem]">
          <button
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="w-11 h-11 rounded-full bg-white/15 backdrop-blur flex items-center justify-center mb-4 hover:bg-white/25 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <p className="text-sm text-primary-foreground/70">Minhas reservas</p>
          <h1 className="text-2xl font-bold">Gerenciar reservas</h1>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-foreground">Próximas</h2>
            <span className="text-xs text-muted-foreground">{items.length} reservas</span>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Você não tem reservas ativas.</p>
            </div>
          ) : (
            items.map((r) => (
              <div
                key={r.id}
                className="bg-card rounded-3xl p-4 shadow-card flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shrink-0">
                  <Calendar className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground truncate">{r.roomName}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {r.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {r.time}
                    </span>
                  </div>
                  <div className="mt-2">
                    {r.status === "confirmada" ? (
                      <Badge className="rounded-full text-[10px] font-medium bg-success/15 text-success hover:bg-success/15 border-0">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Confirmada
                      </Badge>
                    ) : (
                      <Badge className="rounded-full text-[10px] font-medium bg-warning/15 text-warning hover:bg-warning/15 border-0">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Pendente
                      </Badge>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleCancel(r.id)}
                  aria-label="Cancelar reserva"
                  className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </MobileFrame>
  );
};

export default Reservas;
