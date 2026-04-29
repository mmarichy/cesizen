import { Suspense } from "react";
import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { LoginForm } from "@/components/auth/login/login-form";

export default function LoginPage() {
  return (
    <AuthPageLayout active="login">
      <Suspense fallback={<div className="min-h-[280px]" aria-hidden />}>
        <LoginForm />
      </Suspense>
    </AuthPageLayout>
  );
}
