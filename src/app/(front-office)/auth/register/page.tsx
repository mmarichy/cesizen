import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { RegisterForm } from "@/components/auth/register/register-form";

export default function RegisterPage() {
  return (
    <AuthPageLayout active="register">
      <RegisterForm />
    </AuthPageLayout>
  );
}
