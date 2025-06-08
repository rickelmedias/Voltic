"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useLogin } from "@/api/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const router                  = useRouter();
  const { mutateAsync: login, isPending } = useLogin();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await login({ data: { username: email, password } })

      if (!res.token) {
        throw new Error("Token ausente na resposta");
      }

      document.cookie = `token=${res.token}; Path=/; SameSite=Lax`;

      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o dashboard…",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 401 || status === 404) {
        toast({
          title: "Credenciais inválidas",
          description: "Verifique e tente novamente.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro inesperado",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Entre com seu e-mail para acessar a conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Entrando…" : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
