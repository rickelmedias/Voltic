"use client";

import { useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
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
import { toast } from "@/hooks/use-toast"; // ✅ Toast customizado

import { createUser } from "@/services/user.service";
import type { UserDTO } from "@/api/models/UserDTO";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      const payload: UserDTO = {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
      };

      try {
        await createUser(payload);

        toast({
          title: "Conta criada com sucesso!",
          description: "Você será redirecionado para o login...",
        });

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (error: any) {
        if (error.response?.status === 409) {
          toast({
            title: "Erro ao registrar",
            description: "Este e-mail já está em uso.",
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
    },
    [router]
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Registrar</CardTitle>
          <CardDescription>
            Crie sua conta para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">E-mail</Label>
              <Input id="username" name="username" type="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Registrar
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-2">
              Já tem conta?{" "}
              <a href="/login" className="underline underline-offset-4">
                Faça login
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
