"use client";

import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useRegistrationStore,
  stepThreeSchema,
} from "@/stores/useRegistrationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

type Step3FormValues = z.infer<typeof stepThreeSchema>;

export default function Step3Form() {
  const { formData, setFormData, nextStep, prevStep, jumpToStep } =
    useRegistrationStore();

  const form = useForm<Step3FormValues>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: {
      plusOneName: formData.plusOneName ?? "",
      plusOneEmail: formData.plusOneEmail ?? "",
      plusOnePhone: formData.plusOnePhone ?? "",
      isFreelifer: formData.isFreelifer ?? false,
    },
  });

  const isFreelifer = useWatch({
    control: form.control,
    name: "isFreelifer",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<Step3FormValues> = async (data) => {
    setFormData(data);

    if (data.isFreelifer) {
      toast.success(
        "Community perk unlocked! Let's get your free guest passes.",
      );
      nextStep();
    } else {
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, ...data }),
        });

        if (!response.ok) throw new Error("Registration failed");

        toast.success("Details confirmed. Reservation complete.");
        jumpToStep(5);
      } catch (error) {
        console.log("Error submitting reservation:", error);
        toast.error("Failed to submit reservation. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700"
    >
      <div className="space-y-5">
        <div className="text-center pb-2">
          <p className="text-zinc-400 text-sm font-light">
            You selected the Purple Ball experience. Please provide the details
            of the guest accompanying you.
          </p>
        </div>

        <div>
          <Input
            {...form.register("plusOneName")}
            placeholder="Guest's Full Name"
            className="h-14 w-full rounded-full bg-black/50 border-zinc-800 text-zinc-100 px-6 font-light focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:border-purple-500 transition-all"
          />
          {form.formState.errors.plusOneName && (
            <p className="text-rose-500 text-xs px-4 mt-2">
              {form.formState.errors.plusOneName.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Input
              {...form.register("plusOneEmail")}
              type="email"
              placeholder="Guest's Email Address"
              className="h-14 w-full rounded-full bg-black/50 border-zinc-800 text-zinc-100 px-6 font-light focus-visible:ring-1 focus-visible:ring-purple-500"
            />
            {form.formState.errors.plusOneEmail && (
              <p className="text-rose-500 text-xs px-4 mt-2">
                {form.formState.errors.plusOneEmail.message}
              </p>
            )}
          </div>
          <div>
            <Input
              {...form.register("plusOnePhone")}
              type="tel"
              placeholder="Guest's Phone Number"
              className="h-14 w-full rounded-full bg-black/50 border-zinc-800 text-zinc-100 px-6 font-light focus-visible:ring-1 focus-visible:ring-purple-500"
            />
            {form.formState.errors.plusOnePhone && (
              <p className="text-rose-500 text-xs px-4 mt-2">
                {form.formState.errors.plusOnePhone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-300 tracking-wide uppercase px-2 text-center">
          Is your Plus One a member of the Freelife Community?
        </h3>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() =>
              form.setValue("isFreelifer", true, { shouldValidate: true })
            }
            className={`w-full flex items-center p-5 rounded-[2rem] border transition-all duration-500 text-left ${
              isFreelifer === true
                ? "bg-purple-900/20 border-purple-500/50 shadow-[0_0_15px_rgba(124,58,237,0.15)]"
                : "bg-black/50 border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${isFreelifer === true ? "border-purple-400" : "border-zinc-600"}`}
            >
              {isFreelifer === true && (
                <div className="w-2.5 h-2.5 bg-purple-400 rounded-full" />
              )}
            </div>
            <div>
              <h3
                className={`text-base font-medium ${isFreelifer === true ? "text-purple-300" : "text-zinc-200"}`}
              >
                Yes, they are a Freelifer
              </h3>
              <p className="text-zinc-500 text-sm font-light mt-0.5">
                Unlocks two free matchmaking guest passes for your single
                friends.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              form.setValue("isFreelifer", false, { shouldValidate: true })
            }
            className={`w-full flex items-center p-5 rounded-[2rem] border transition-all duration-500 text-left ${
              isFreelifer === false
                ? "bg-purple-900/20 border-purple-500/50 shadow-[0_0_15px_rgba(124,58,237,0.15)]"
                : "bg-black/50 border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${isFreelifer === false ? "border-purple-400" : "border-zinc-600"}`}
            >
              {isFreelifer === false && (
                <div className="w-2.5 h-2.5 bg-purple-400 rounded-full" />
              )}
            </div>
            <div>
              <h3
                className={`text-base font-medium ${isFreelifer === false ? "text-purple-300" : "text-zinc-200"}`}
              >
                No, they are an external guest
              </h3>
              <p className="text-zinc-500 text-sm font-light mt-0.5">
                Standard registration. No additional guests required.
              </p>
            </div>
          </button>
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
              <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
            </>
          ) : isFreelifer ? (
            <>
              <span className="hidden sm:inline">Continue to </span>Guest Passes{" "}
              <UserPlus className="w-5 h-5" />
            </>
          ) : (
            <>
              Complete Registration <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
