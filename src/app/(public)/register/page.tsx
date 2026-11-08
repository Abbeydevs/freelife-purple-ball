"use client";

import { useRegistrationStore } from "@/stores/useRegistrationStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  HeartHandshake,
  UtensilsCrossed,
  Users,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import Step1Form from "@/components/forms/Step1Form";
import Step2Form from "@/components/forms/Step2Form";
import Step3Form from "@/components/forms/Step3Form";
import Step4Form from "@/components/forms/Step4Form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegistrationPage() {
  const { currentStep } = useRegistrationStore();

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 font-sans">
      <Card className="relative z-10 w-full max-w-2xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/5 rounded-md shadow-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-zinc-900 w-full">
          <div
            className="h-full bg-purple-600 transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(124,58,237,0.5)]"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        <CardHeader className="space-y-4 pb-8 pt-14 px-6 sm:px-12 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center mb-2">
            {currentStep === 1 && (
              <HeartHandshake className="w-6 h-6 text-purple-400" />
            )}
            {currentStep === 2 && (
              <UtensilsCrossed className="w-6 h-6 text-purple-400" />
            )}
            {currentStep === 3 && <Users className="w-6 h-6 text-purple-400" />}
            {currentStep === 4 && (
              <Sparkles className="w-6 h-6 text-purple-400" />
            )}
            {currentStep === 5 && (
              <CheckCircle2 className="w-6 h-6 text-purple-400" />
            )}
          </div>

          <CardTitle className="text-3xl sm:text-4xl font-light tracking-tight text-white">
            {currentStep === 1 && "Your Invitation Awaits"}
            {currentStep === 2 && "Curate Your Evening"}
            {currentStep === 3 && "Who is accompanying you?"}
            {currentStep === 4 && "The Free Guest Pass"}
            {currentStep === 5 && "Reservation Complete"}
          </CardTitle>

          <CardDescription className="text-zinc-400 text-sm sm:text-base font-light">
            {currentStep === 1 &&
              "Begin by entering your details and confirming your support."}
            {currentStep === 2 &&
              "Select how you would like to experience the night."}
            {currentStep === 3 &&
              "Please provide the details of your Plus One."}
            {currentStep === 4 && "Invite two friends to join the celebration."}
            {currentStep === 5 &&
              "Your reservation has been received. You will receive an email shortly once verified."}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 sm:px-12 pb-12">
          {currentStep === 1 && <Step1Form />}
          {currentStep === 2 && <Step2Form />}
          {currentStep === 3 && <Step3Form />}
          {currentStep === 4 && <Step4Form />}

          {currentStep === 5 && (
            <div className="text-center space-y-6 py-6 animate-in fade-in duration-700">
              <div className="w-20 h-20 bg-purple-900/20 border border-purple-500/40 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-purple-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-normal text-white">
                  You are all set!
                </h3>
                <p className="text-sm text-zinc-400 font-light max-w-sm mx-auto">
                  Our admin team is verifying your transfer receipt. Your gate
                  access tokens and matchmaking details will be emailed to you.
                </p>
              </div>
              <Link href="/" className="inline-block pt-4">
                <Button className="h-12 px-8 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 font-light text-sm">
                  Return to Home
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
