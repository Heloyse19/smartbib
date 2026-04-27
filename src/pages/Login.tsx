import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileFrame } from "@/components/MobileFrame";
import iconUrl from "@/assets/smartbib-icon.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("aluno@faculdade.edu.br");
  const [password, setPassword] = useState("••••••••");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/salas");
  };

  return (
    <MobileFrame>
      <div className="flex-1 gradient-hero flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-primary-foreground">
          <img src={iconUrl} alt="SmartBib" className="w-24 h-24 rounded-3xl shadow-glow mb-6" />
          <h1 className="text-4xl font-extrabold tracking-tight">SmartBib</h1>
          <p className="text-primary-foreground/80 mt-2 text-center">
            Reserve salas da biblioteca<br />de forma inteligente
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-background rounded-t-[2.5rem] px-7 pt-8 pb-10 space-y-5"
        >
          <h2 className="text-2xl font-bold text-foreground">Entrar</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">E-mail institucional</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 pl-12 rounded-2xl bg-muted border-0"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 pl-12 rounded-2xl bg-muted border-0"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full h-14 rounded-2xl gradient-primary text-primary-foreground font-semibold text-base shadow-soft hover:opacity-90"
          >
            Entrar
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Não tem conta?{" "}
            <button
              type="button"
              onClick={() => navigate("/cadastro")}
              className="text-primary font-semibold"
            >
              Cadastre-se
            </button>
          </p>
        </form>
      </div>
    </MobileFrame>
  );
};

export default Login;
