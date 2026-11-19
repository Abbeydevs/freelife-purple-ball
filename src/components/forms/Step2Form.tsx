"use client";

import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useRegistrationStore,
  stepTwoSchema,
} from "@/stores/useRegistrationStore";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  UserPlus,
  Link as LinkIcon,
} from "lucide-react";

type Step2FormValues = z.infer<typeof stepTwoSchema>;

export default function Step2Form() {
  const { formData, setFormData, nextStep, prevStep, jumpToStep } =
    useRegistrationStore();

  const form = useForm<Step2FormValues>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      isPlusOneReady: formData.isPlusOneReady,
    },
  });

  const isReady = useWatch({ control: form.control, name: "isPlusOneReady" });

  const onSubmit: SubmitHandler<Step2FormValues> = (data) => {
    setFormData(data);
    if (data.isPlusOneReady) {
      nextStep();
    } else {
      jumpToStep(5);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700"
    >
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-300 tracking-wide uppercase px-2 text-center">
          Are you registering with your Plus One right now?
        </h3>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() =>
              form.setValue("isPlusOneReady", true, { shouldValidate: true })
            }
            className={`w-full flex items-center p-6 rounded-[2rem] border transition-all duration-500 text-left ${isReady === true ? "bg-purple-900/20 border-purple-500/50 shadow-[0_0_15px_rgba(124,58,237,0.15)]" : "bg-black/50 border-zinc-800 hover:border-zinc-700"}`}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center shrink-0 ${isReady === true ? "border-purple-400" : "border-zinc-600"}`}
            >
              {isReady === true && (
                <div className="w-3 h-3 bg-purple-400 rounded-full" />
              )}
            </div>
            <div>
              <h3
                className={`text-base font-medium flex items-center gap-2 ${isReady === true ? "text-purple-300" : "text-zinc-200"}`}
              >
                Yes, they are ready <UserPlus className="w-4 h-4" />
              </h3>
              <p className="text-zinc-500 text-sm font-light mt-1">
                I will enter their details and pay for both of us now.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              form.setValue("isPlusOneReady", false, { shouldValidate: true })
            }
            className={`w-full flex items-center p-6 rounded-[2rem] border transition-all duration-500 text-left ${isReady === false ? "bg-purple-900/20 border-purple-500/50 shadow-[0_0_15px_rgba(124,58,237,0.15)]" : "bg-black/50 border-zinc-800 hover:border-zinc-700"}`}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center shrink-0 ${isReady === false ? "border-purple-400" : "border-zinc-600"}`}
            >
              {isReady === false && (
                <div className="w-3 h-3 bg-purple-400 rounded-full" />
              )}
            </div>
            <div>
              <h3
                className={`text-base font-medium flex items-center gap-2 ${isReady === false ? "text-purple-300" : "text-zinc-200"}`}
              >
                No, I will invite them later <LinkIcon className="w-4 h-4" />
              </h3>
              <p className="text-zinc-500 text-sm font-light mt-1">
                I will get a unique link to send them when they are ready.
              </p>
            </div>
          </button>
        </div>
        {form.formState.errors.isPlusOneReady && (
          <p className="text-rose-500 text-xs px-4 mt-2 text-center">
            {form.formState.errors.isPlusOneReady.message}
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
          className="w-full h-14 rounded-full bg-white text-black hover:bg-zinc-200 font-medium text-lg flex items-center justify-center gap-2"
        >
          {isReady ? "Add Plus One" : "Continue to Payment"}{" "}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
}
