import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, IdCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileFrame } from "@/components/MobileFrame";
import { toast } from "sonner";
import iconUrl from "@/assets/smartbib-icon.png";

const Cadastro = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [matricula, setMatricula] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha || !matricula) {
      toast.error("Preencha todos os campos");
      return;
    }
    toast.success("Cadastro realizado!", { description: "Bem-vindo ao SmartBib" });
    setTimeout(() => navigate("/salas"), 1000);
  };

  return (
    <MobileFrame>
      <div className="flex-1 gradient-hero flex flex-col">
        <div className="px-6 pt-12 pb-6 text-primary-foreground">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-full bg-white/15 backdrop-blur flex items-center justify-center mb-4"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <img src={iconUrl} alt="SmartBib" className="w-14 h-14 rounded-2xl shadow-glow" />
            <div>
              <h1 className="text-2xl font-extrabold">Criar conta</h1>
              <p className="text-primary-foreground/80 text-sm">Cadastre-se no SmartBib</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-background rounded-t-[2.5rem] px-7 pt-8 pb-10 space-y-5"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">E-mail institucional</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aluno@faculdade.edu.br"
                className="h-14 pl-12 rounded-2xl bg-muted border-0"
                maxLength={120}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Matrícula</label>
            <div className="relative">
              <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                placeholder="Ex: 2025001234"
                className="h-14 pl-12 rounded-2xl bg-muted border-0"
                maxLength={20}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="h-14 pl-12 rounded-2xl bg-muted border-0"
                maxLength={64}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-14 rounded-2xl gradient-primary text-primary-foreground font-semibold text-base shadow-soft hover:opacity-90"
          >
            Cadastrar
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <button type="button" onClick={() => navigate("/")} className="text-primary font-semibold">
              Entrar
            </button>
          </p>
        </form>
      </div>
    </MobileFrame>
  );
};

export default Cadastro;
