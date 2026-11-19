"use client";

import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useRegistrationStore,
  stepOneSchema,
} from "@/stores/useRegistrationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, UtensilsCrossed, GlassWater } from "lucide-react";

type Step1FormValues = z.infer<typeof stepOneSchema>;

export default function Step1Form() {
  const { formData, setFormData, nextStep, jumpToStep } =
    useRegistrationStore();

  const form = useForm<Step1FormValues>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      attendeeName: formData.attendeeName ?? "",
      attendeeEmail: formData.attendeeEmail ?? "",
      attendeePhone: formData.attendeePhone ?? "",
      eventType: formData.eventType,
    },
  });

  const currentEventType = useWatch({
    control: form.control,
    name: "eventType",
  });

  const onSubmit: SubmitHandler<Step1FormValues> = (data) => {
    setFormData(data);
    if (data.eventType === "AFTER_PARTY_ONLY") {
      jumpToStep(5);
    } else {
      nextStep();
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700"
    >
      <div className="space-y-5">
        <div>
          <Input
            {...form.register("attendeeName")}
            placeholder="Your Full Name"
            className="h-14 w-full rounded-full bg-black/50 border-zinc-800 text-zinc-100 px-6 font-light focus-visible:ring-1 focus-visible:ring-purple-500"
          />
          {form.formState.errors.attendeeName && (
            <p className="text-rose-500 text-xs px-4 mt-2">
              {form.formState.errors.attendeeName.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Input
              {...form.register("attendeeEmail")}
              type="email"
              placeholder="Email Address"
              className="h-14 w-full rounded-full bg-black/50 border-zinc-800 text-zinc-100 px-6 font-light focus-visible:ring-1 focus-visible:ring-purple-500"
            />
            {form.formState.errors.attendeeEmail && (
              <p className="text-rose-500 text-xs px-4 mt-2">
                {form.formState.errors.attendeeEmail.message}
              </p>
            )}
          </div>
          <div>
            <Input
              {...form.register("attendeePhone")}
              type="tel"
              placeholder="Phone Number"
              className="h-14 w-full rounded-full bg-black/50 border-zinc-800 text-zinc-100 px-6 font-light focus-visible:ring-1 focus-visible:ring-purple-500"
            />
            {form.formState.errors.attendeePhone && (
              <p className="text-rose-500 text-xs px-4 mt-2">
                {form.formState.errors.attendeePhone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2 border-t border-white/5">
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
            className={`w-full flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-500 text-left ${currentEventType === "PURPLE_BALL_AND_AFTER_PARTY" ? "bg-purple-900/20 border-purple-500/50 shadow-[0_0_15px_rgba(124,58,237,0.15)]" : "bg-black/50 border-zinc-800 hover:border-zinc-700"}`}
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
            className={`w-full flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-500 text-left ${currentEventType === "AFTER_PARTY_ONLY" ? "bg-purple-900/20 border-purple-500/50 shadow-[0_0_15px_rgba(124,58,237,0.15)]" : "bg-black/50 border-zinc-800 hover:border-zinc-700"}`}
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

      <Button
        type="submit"
        className="w-full h-14 rounded-full bg-white text-black hover:bg-zinc-200 font-medium text-lg mt-8 flex items-center justify-center gap-2"
      >
        Continue <ArrowRight className="w-5 h-5" />
      </Button>
    </form>
  );
}
