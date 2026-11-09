/* eslint-disable @next/next/no-img-element */
import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  HeartHandshake,
  UtensilsCrossed,
  GlassWater,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  Users,
  Loader2,
} from "lucide-react";

async function HomeContent() {
  let registeredCount = 0;
  try {
    registeredCount = await prisma.booking.count({
      where: { status: { not: "REJECTED" } },
    });
  } catch (error) {
    console.error("Error fetching registered count:", error);
    registeredCount = 0;
  }

  return (
    <>
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 flex items-center justify-center">
        <Link
          href="/"
          className="inline-block hover:opacity-80 transition-opacity"
        >
          <img
            src="/logo.png"
            alt="Freelife Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full shadow-[0_0_20px_rgba(124,58,237,0.3)] bg-white border border-purple-500/20"
          />
        </Link>
      </header>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-20 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/60 border border-purple-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(124,58,237,0.2)]">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-xs sm:text-sm font-light tracking-widest uppercase text-zinc-300">
            Celebrating 7 Years of Impact • {registeredCount} Registered
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-light tracking-tight uppercase text-white leading-[1.05]">
            Purple Ball <br />
            <span className="font-normal text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-fuchsia-300 to-purple-500">
              & After Party
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-zinc-400 text-base sm:text-lg font-light pt-2 leading-relaxed">
            An evening of elegance, connection & celebration. Come with your
            plus one for a night of fine dining, high energy, and unforgettable
            memories.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/register" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-16 px-10 rounded-full bg-white hover:bg-zinc-200 text-black font-medium text-lg tracking-wide shadow-2xl transition-all flex items-center justify-center gap-3">
              <HeartHandshake className="w-5 h-5 text-purple-600" />
              Register for Event
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 bg-[#0a0a0a]/80 backdrop-blur-md border border-zinc-800/80 rounded-full py-4 px-6">
            <Calendar className="w-5 h-5 text-purple-400 shrink-0" />
            <span className="text-sm font-light text-zinc-200">
              Friday, Dec 11, 2026
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 bg-[#0a0a0a]/80 backdrop-blur-md border border-zinc-800/80 rounded-full py-4 px-6">
            <Clock className="w-5 h-5 text-purple-400 shrink-0" />
            <span className="text-sm font-light text-zinc-200">
              Dinner & After Party
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 bg-[#0a0a0a]/80 backdrop-blur-md border border-zinc-800/80 rounded-full py-4 px-6">
            <Users className="w-5 h-5 text-purple-400 shrink-0" />
            <span className="text-sm font-light text-zinc-200">
              Strictly Plus One
            </span>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-light text-white tracking-tight">
            The Experience
          </h2>
          <p className="text-zinc-500 text-sm font-light">
            Choose your preferred way to celebrate with the community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-zinc-800/80 rounded-md p-8 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-purple-900/20 border border-purple-500/30 flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-normal text-white">
              The Purple Ball (Dinner)
            </h3>
            <p className="text-zinc-400 text-sm font-light leading-relaxed">
              An intimate dinner date experience. Requires attending with a Plus
              One. If your Plus One is a Freelifer, you unlock exclusive free
              guest passes to matchmake two single friends!
            </p>
          </Card>

          <Card className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-zinc-800/80 rounded-md p-8 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-purple-900/20 border border-purple-500/30 flex items-center justify-center">
              <GlassWater className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-normal text-white">The After Party</h3>
            <p className="text-zinc-400 text-sm font-light leading-relaxed">
              Can&apos;t make the dinner? Join us later for the vibrant
              after-party hangout. Come ready to mingle, network, and celebrate
              7 incredible years of Freelife.
            </p>
          </Card>
        </div>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 py-12 pb-24">
        <Card className="bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/5 rounded-md p-8 sm:p-12 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <span className="text-xs uppercase tracking-widest text-purple-400 font-light">
                Support The Movement
              </span>
              <h3 className="text-2xl sm:text-3xl font-light text-white">
                Support Contribution (Minimum ₦10,000)
              </h3>
              <p className="text-zinc-400 text-sm font-light max-w-xl">
                This is a support contribution rather than a gate fee. Give any
                amount starting from ₦10,000 to secure your registration.
              </p>
            </div>
            <Link href="/register">
              <Button className="h-14 px-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-base shrink-0 shadow-lg transition-all">
                Get Started Now
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen text-zinc-100 font-sans selection:bg-purple-600 selection:text-white">
      <div className="absolute top-[-10%] left-[-10%] w-160 h-160 bg-purple-900/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-160 h-160 bg-fuchsia-900/10 rounded-full blur-[150px] pointer-events-none z-0" />

      <Suspense
        fallback={
          <div className="min-h-screen flex flex-col items-center justify-center text-zinc-400 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            <p className="font-light text-sm tracking-widest uppercase">
              Loading Purple Ball...
            </p>
          </div>
        }
      >
        <HomeContent />
      </Suspense>
    </main>
  );
}
