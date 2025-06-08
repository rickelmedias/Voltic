"use client";

import { useEffect } from "react";
import { LoginForm } from "@/components/login-form";

export default function Page() {
  useEffect(() => {
    document.cookie =
      "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;";
  }, []);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
