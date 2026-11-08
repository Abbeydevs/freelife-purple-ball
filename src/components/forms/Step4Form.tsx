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
import { ArrowLeft, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

type Step4FormValues = z.infer<typeof stepFourSchema>;

export default function Step4Form() {
  const { formData, setFormData, prevStep, jumpToStep } =
    useRegistrationStore();

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<Step4FormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ...data }),
      });

      if (!response.ok) throw new Error("Registration failed");

      toast.success("Guest passes prepared. Reservation complete.");
      jumpToStep(5);
    } catch (error) {
      console.log("Error submitting reservation:", error);
      toast.error("Failed to submit reservation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700"
    >
      <div className="text-center pb-2">
        <p className="text-zinc-400 text-sm font-light">
          You and your Plus One have unlocked two free guest passes. Invite two
          single friends to be matchmade for the evening.
        </p>
      </div>

      <div className="space-y-8">
        <div className="p-6 rounded-[2rem] border border-zinc-800 bg-black/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
          <h3 className="text-sm font-semibold text-purple-300 tracking-wide uppercase mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Guest invited by You
          </h3>

          <div className="space-y-4">
            <div>
              <Input
                {...form.register("primaryGuestName")}
                placeholder="Guest's Full Name"
                className="h-12 w-full rounded-full bg-zinc-900/50 border-zinc-800 text-zinc-100 px-6 font-light focus-visible:ring-1 focus-visible:ring-purple-500"
              />
              {form.formState.errors.primaryGuestName && (
                <p className="text-rose-500 text-xs px-4 mt-2">
                  {form.formState.errors.primaryGuestName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  {...form.register("primaryGuestEmail")}
                  type="email"
                  placeholder="Email Address"
                  className="h-12 w-full rounded-full bg-zinc-900/50 border-zinc-800 text-zinc-100 px-6 font-light focus-visible:ring-1 focus-visible:ring-purple-500"
                />
                {form.formState.errors.primaryGuestEmail && (
                  <p className="text-rose-500 text-xs px-4 mt-2">
                    {form.formState.errors.primaryGuestEmail.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  {...form.register("primaryGuestPhone")}
                  type="tel"
                  placeholder="Phone Number"
                  className="h-12 w-full rounded-full bg-zinc-900/50 border-zinc-800 text-zinc-100 px-6 font-light focus-visible:ring-1 focus-visible:ring-purple-500"
                />
                {form.formState.errors.primaryGuestPhone && (
                  <p className="text-rose-500 text-xs px-4 mt-2">
                    {form.formState.errors.primaryGuestPhone.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-[2rem] border border-zinc-800 bg-black/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-fuchsia-500" />
          <h3 className="text-sm font-semibold text-fuchsia-300 tracking-wide uppercase mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Guest invited by your Plus One
          </h3>

          <div className="space-y-4">
            <div>
              <Input
                {...form.register("plusOneGuestName")}
                placeholder="Guest's Full Name"
                className="h-12 w-full rounded-full bg-zinc-900/50 border-zinc-800 text-zinc-100 px-6 font-light focus-visible:ring-1 focus-visible:ring-fuchsia-500"
              />
              {form.formState.errors.plusOneGuestName && (
                <p className="text-rose-500 text-xs px-4 mt-2">
                  {form.formState.errors.plusOneGuestName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  {...form.register("plusOneGuestEmail")}
                  type="email"
                  placeholder="Email Address"
                  className="h-12 w-full rounded-full bg-zinc-900/50 border-zinc-800 text-zinc-100 px-6 font-light focus-visible:ring-1 focus-visible:ring-fuchsia-500"
                />
                {form.formState.errors.plusOneGuestEmail && (
                  <p className="text-rose-500 text-xs px-4 mt-2">
                    {form.formState.errors.plusOneGuestEmail.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  {...form.register("plusOneGuestPhone")}
                  type="tel"
                  placeholder="Phone Number"
                  className="h-12 w-full rounded-full bg-zinc-900/50 border-zinc-800 text-zinc-100 px-6 font-light focus-visible:ring-1 focus-visible:ring-fuchsia-500"
                />
                {form.formState.errors.plusOneGuestPhone && (
                  <p className="text-rose-500 text-xs px-4 mt-2">
                    {form.formState.errors.plusOneGuestPhone.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-white/5">
        <Button
          type="button"
          onClick={prevStep}
          className="h-14 w-14 rounded-full bg-black/50 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 p-0 shrink-0 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14 rounded-full bg-white text-black hover:bg-zinc-200 font-medium text-lg transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Finalizing...
            </>
          ) : (
            <>
              Submit Reservation <CheckCircle2 className="w-5 h-5" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
