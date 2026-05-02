import { SignInForm } from "@/components/auth/SignInForm";

export const metadata = { title: "Create account" };

export default function SignUpPage() {
  return <SignInForm mode="signup" />;
}
