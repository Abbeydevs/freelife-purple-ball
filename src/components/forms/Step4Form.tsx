"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useRegistrationStore,
  stepFourSchema,
} from "@/stores/useRegistrationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

type Step4FormValues = z.infer<typeof stepFourSchema>;

export default function Step4Form() {
  const { formData, setFormData, prevStep, nextStep } = useRegistrationStore();

  const form = useForm<Step4FormValues>({
    resolver: zodResolver(stepFourSchema),
    defaultValues: {
      primaryGuestName: formData.primaryGuestName ?? "",
      primaryGuestEmail: formData.primaryGuestEmail ?? "",
      primaryGuestPhone: formData.primaryGuestPhone ?? "",
      plusOneGuestName: formData.plusOneGuestName ?? "",
      plusOneGuestEmail: formData.plusOneGuestEmail ?? "",
      plusOneGuestPhone: formData.plusOneGuestPhone ?? "",
    },
  });

  const onSubmit: SubmitHandler<Step4FormValues> = (data) => {
    setFormData(data);
    nextStep();
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700"
    >
      <div className="text-center pb-2">
        <p className="text-zinc-400 text-sm font-light">
          You and your Plus One unlocked two free guest passes. Invite two
          single friends to be matchmade (Optional).
        </p>
      </div>

      <div className="space-y-8">
        <div className="p-6 rounded-[2rem] border border-zinc-800 bg-black/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
          <h3 className="text-sm font-semibold text-purple-300 tracking-wide uppercase mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Guest invited by You
          </h3>
          <div className="space-y-4">
            <Input
              {...form.register("primaryGuestName")}
              placeholder="Guest's Full Name (Optional)"
              className="h-12 w-full rounded-full bg-zinc-900/50 border-zinc-800 text-zinc-100 px-6 font-light focus-visible:ring-1 focus-visible:ring-purple-500"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                {...form.register("primaryGuestEmail")}
                type="email"
                placeholder="Email Address (Optional)"
                className="h-12 w-full rounded-full bg-zinc-900/50 border-zinc-800 text-zinc-100 px-6 font-light focus-visible:ring-1 focus-visible:ring-purple-500"
              />
              <Input
                {...form.register("primaryGuestPhone")}
                type="tel"
                placeholder="Phone Number (Optional)"
                className="h-12 w-full rounded-full bg-zinc-900/50 border-zinc-800 text-zinc-100 px-6 font-light focus-visible:ring-1 focus-visible:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-[2rem] border border-zinc-800 bg-black/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-fuchsia-500" />
          <h3 className="text-sm font-semibold text-fuchsia-300 tracking-wide uppercase mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Guest invited by your Plus One
          </h3>
          <div className="space-y-4">
            <Input
              {...form.register("plusOneGuestName")}
              placeholder="Guest's Full Name (Optional)"
              className="h-12 w-full rounded-full bg-zinc-900/50 border-zinc-800 text-zinc-100 px-6 font-light focus-visible:ring-1 focus-visible:ring-fuchsia-500"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                {...form.register("plusOneGuestEmail")}
                type="email"
                placeholder="Email Address (Optional)"
                className="h-12 w-full rounded-full bg-zinc-900/50 border-zinc-800 text-zinc-100 px-6 font-light focus-visible:ring-1 focus-visible:ring-fuchsia-500"
              />
              <Input
                {...form.register("plusOneGuestPhone")}
                type="tel"
                placeholder="Phone Number (Optional)"
                className="h-12 w-full rounded-full bg-zinc-900/50 border-zinc-800 text-zinc-100 px-6 font-light focus-visible:ring-1 focus-visible:ring-fuchsia-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-white/5">
        <Button
          type="button"
          onClick={prevStep}
          className="h-14 w-14 rounded-full bg-black/50 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 p-0 shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Button
          type="submit"
          className="w-full h-14 rounded-full bg-white text-black hover:bg-zinc-200 font-medium text-lg flex items-center justify-center gap-2"
        >
          Continue to Payment <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
}
