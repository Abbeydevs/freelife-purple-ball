"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Lock, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [passcode, setPasscode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await loginAdmin(passcode);
      if (response.success) {
        toast.success("Access Granted. Welcome back.");
        router.push("/admin/dashboard");
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error("Error during admin login:", error);
      toast.error("Something went wrong verifying the code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 bg-[#0B0410] font-sans">
      <div className="absolute inset-0 bg-purple-900/5 blur-[150px] pointer-events-none" />

      <Card className="relative z-10 w-full max-w-md bg-[#160B24]/90 backdrop-blur-xl border border-purple-500/20 rounded-[2rem] shadow-2xl overflow-hidden">
        <CardHeader className="text-center pb-6 pt-10">
          <div className="w-16 h-16 mx-auto bg-purple-900/30 border border-purple-500/40 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Lock className="w-7 h-7 text-purple-400" />
          </div>
          <CardTitle className="text-2xl font-light text-white tracking-wide">
            Executive Access
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm font-light mt-2">
            Enter the master passcode to manage the Purple Ball & After Party.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              type="password"
              placeholder="Enter Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="h-14 w-full rounded-full bg-black/50 border-zinc-800 text-center text-zinc-100 px-6 font-mono text-lg tracking-[0.3em] focus-visible:ring-1 focus-visible:ring-purple-500 placeholder:tracking-normal placeholder:font-sans"
              autoFocus
            />
            <Button
              type="submit"
              disabled={isSubmitting || !passcode}
              className="w-full h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-base transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.3)]"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Verify Passcode <ShieldCheck className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
