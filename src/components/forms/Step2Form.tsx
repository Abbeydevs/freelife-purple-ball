"use client";

import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useRegistrationStore,
  stepTwoSchema,
} from "@/stores/useRegistrationStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, GlassWater, Loader2, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

type Step2FormValues = z.infer<typeof stepTwoSchema>;

export default function Step2Form() {
  const { formData, setFormData, nextStep, prevStep, jumpToStep } =
    useRegistrationStore();

  const form = useForm<Step2FormValues>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      eventType: formData.eventType,
    },
  });

  const currentEventType = useWatch({
    control: form.control,
    name: "eventType",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<Step2FormValues> = async (data) => {
    setFormData(data);

    if (data.eventType === "AFTER_PARTY_ONLY") {
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, ...data }),
        });

        if (!response.ok) throw new Error("Registration failed");

        toast.success("Ready for the after party! Reservation complete.");
        jumpToStep(5);
      } catch (error) {
        console.log("Error submitting registration:", error);
        toast.error("Failed to submit registration. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      nextStep();
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700"
    >
      <div className="space-y-4">
        <p className="text-sm text-zinc-400 font-light px-2">
          Please select your experience for December 11th:
        </p>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() =>
              form.setValue("eventType", "PURPLE_BALL_AND_AFTER_PARTY", {
                shouldValidate: true,
              })
            }
            className={`w-full flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-500 text-left ${
              currentEventType === "PURPLE_BALL_AND_AFTER_PARTY"
                ? "bg-purple-900/20 border-purple-500/50 shadow-[0_0_15px_rgba(124,58,237,0.15)]"
                : "bg-black/50 border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <div>
              <h3
                className={`text-lg font-medium ${currentEventType === "PURPLE_BALL_AND_AFTER_PARTY" ? "text-purple-300" : "text-zinc-200"}`}
              >
                Purple Ball & After Party
              </h3>
              <p className="text-zinc-500 text-sm font-light mt-1">
                The full dinner experience. You will be required to bring a Plus
                One.
              </p>
            </div>
            <UtensilsCrossed
              className={`w-6 h-6 ${currentEventType === "PURPLE_BALL_AND_AFTER_PARTY" ? "text-purple-400" : "text-zinc-700"}`}
            />
          </button>

          <button
            type="button"
            onClick={() =>
              form.setValue("eventType", "AFTER_PARTY_ONLY", {
                shouldValidate: true,
              })
            }
            className={`w-full flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-500 text-left ${
              currentEventType === "AFTER_PARTY_ONLY"
                ? "bg-purple-900/20 border-purple-500/50 shadow-[0_0_15px_rgba(124,58,237,0.15)]"
                : "bg-black/50 border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <div>
              <h3
                className={`text-lg font-medium ${currentEventType === "AFTER_PARTY_ONLY" ? "text-purple-300" : "text-zinc-200"}`}
              >
                After Party Only
              </h3>
              <p className="text-zinc-500 text-sm font-light mt-1">
                Join us later for the hangout. Coming solo is perfectly fine.
              </p>
            </div>
            <GlassWater
              className={`w-6 h-6 ${currentEventType === "AFTER_PARTY_ONLY" ? "text-purple-400" : "text-zinc-700"}`}
            />
          </button>
        </div>

        {form.formState.errors.eventType && (
          <p className="text-rose-500 text-xs px-4 mt-2">
            {form.formState.errors.eventType.message}
          </p>
        )}
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
          disabled={isSubmitting}
          className="w-full h-14 rounded-full bg-white text-black hover:bg-zinc-200 font-medium text-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
            </>
          ) : currentEventType === "AFTER_PARTY_ONLY" ? (
            "Complete Registration"
          ) : (
            "Continue to Plus One"
          )}
        </Button>
      </div>
    </form>
  );
}
