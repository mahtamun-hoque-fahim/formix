import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex justify-center">
      <SignIn appearance={{
        variables: {
          colorBackground: "#111111",
          colorText: "#f5f5f5",
          colorPrimary: "#6366f1",
          colorInputBackground: "#1a1a1a",
          colorInputText: "#f5f5f5",
          borderRadius: "6px",
        },
      }} />
    </div>
  );
}
