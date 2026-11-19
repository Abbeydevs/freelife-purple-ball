"use client";

import { useState, ChangeEvent } from "react";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useRegistrationStore,
  plusOneDetailsSchema,
  stepFourSchema,
  stepFiveSchema,
} from "@/stores/useRegistrationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  Loader2,
  CheckCircle2,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";

type PlusOneStep1Values = z.infer<typeof plusOneDetailsSchema>;
type PlusOneStep2Values = z.infer<typeof stepFourSchema>;
type PlusOneStep3Values = z.infer<typeof stepFiveSchema>;

export function PlusOneStep1() {
  const { formData, setFormData, nextStep, jumpToStep, parentId } =
    useRegistrationStore();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<PlusOneStep1Values>({
    resolver: zodResolver(plusOneDetailsSchema),
    defaultValues: {
      attendeeName: formData.attendeeName ?? "",
      attendeeEmail: formData.attendeeEmail ?? "",
      attendeePhone: formData.attendeePhone ?? "",
      isFreelifer: formData.isFreelifer ?? false,
    },
  });

  const isFreelifer = useWatch({ control: form.control, name: "isFreelifer" });

  const onSubmit: SubmitHandler<PlusOneStep1Values> = async (data) => {
    setFormData(data);

    if (data.isFreelifer) {
      toast.success(
        "Community perk unlocked! Let's get your free guest passes.",
      );
      nextStep();
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        ...data,
        amount: 0,
        receiptUrl: "",
        eventType: "PURPLE_BALL_AND_AFTER_PARTY" as const,
        parentId: parentId ?? undefined,
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result: { error?: string } = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to submit RSVP");
      }

      toast.success("RSVP confirmed! No payment required for external guests.");
      jumpToStep(4);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 animate-in fade-in duration-700"
    >
      <div className="space-y-5">
        <div>
          <Input
            {...form.register("attendeeName")}
            placeholder="Your Full Name"
            className="h-14 w-full rounded-full bg-black/50 border-zinc-800 text-zinc-100 px-6 font-light focus-visible:ring-purple-500"
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
              className="h-14 w-full rounded-full bg-black/50 border-zinc-800 text-zinc-100 px-6 focus-visible:ring-purple-500"
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
              className="h-14 w-full rounded-full bg-black/50 border-zinc-800 text-zinc-100 px-6 focus-visible:ring-purple-500"
            />
            {form.formState.errors.attendeePhone && (
              <p className="text-rose-500 text-xs px-4 mt-2">
                {form.formState.errors.attendeePhone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-300 uppercase text-center">
          Are you a member of the Freelife Community?
        </h3>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() =>
              form.setValue("isFreelifer", true, { shouldValidate: true })
            }
            className={`w-full flex items-center p-5 rounded-[2rem] border transition-all ${isFreelifer === true ? "bg-purple-900/20 border-purple-500/50" : "bg-black/50 border-zinc-800"}`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center shrink-0 ${isFreelifer === true ? "border-purple-400" : "border-zinc-600"}`}
            >
              {isFreelifer === true && (
                <div className="w-2.5 h-2.5 bg-purple-400 rounded-full" />
              )}
            </div>
            <div className="text-left">
              <h3
                className={`text-base font-medium ${isFreelifer === true ? "text-purple-300" : "text-zinc-200"}`}
              >
                Yes, I am a Freelifer
              </h3>
              <p className="text-zinc-500 text-sm font-light mt-0.5">
                ₦10,000 contribution + unlocks two free matchmaking passes for
                single friends.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              form.setValue("isFreelifer", false, { shouldValidate: true })
            }
            className={`w-full flex items-center p-5 rounded-[2rem] border transition-all ${isFreelifer === false ? "bg-purple-900/20 border-purple-500/50" : "bg-black/50 border-zinc-800"}`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center shrink-0 ${isFreelifer === false ? "border-purple-400" : "border-zinc-600"}`}
            >
              {isFreelifer === false && (
                <div className="w-2.5 h-2.5 bg-purple-400 rounded-full" />
              )}
            </div>
            <div className="text-left">
              <h3
                className={`text-base font-medium ${isFreelifer === false ? "text-purple-300" : "text-zinc-200"}`}
              >
                No, I am an external guest
              </h3>
              <p className="text-zinc-500 text-sm font-light mt-0.5">
                Complimentary access as an invited Plus One. No payment
                required.
              </p>
            </div>
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 rounded-full bg-white text-black hover:bg-zinc-200 font-medium text-lg mt-8 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
          </>
        ) : isFreelifer ? (
          <>
            Continue to Guest Passes <UserPlus className="w-5 h-5" />
          </>
        ) : (
          <>
            Complete Free RSVP <CheckCircle2 className="w-5 h-5" />
          </>
        )}
      </Button>
    </form>
  );
}

export function PlusOneStep2() {
  const { formData, setFormData, prevStep, nextStep } = useRegistrationStore();
  const form = useForm<PlusOneStep2Values>({
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

  const onSubmit: SubmitHandler<PlusOneStep2Values> = (data) => {
    setFormData(data);
    nextStep();
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 animate-in fade-in duration-700"
    >
      <div className="text-center pb-2">
        <p className="text-zinc-400 text-sm font-light">
          As a Freelifer, invite two single friends to be matchmade for the
          evening.
        </p>
      </div>
      <div className="space-y-8">
        <div className="p-6 rounded-[2rem] border border-zinc-800 bg-black/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
          <h3 className="text-sm font-semibold text-purple-300 uppercase mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Guest 1
          </h3>
          <div className="space-y-4">
            <Input
              {...form.register("primaryGuestName")}
              placeholder="Guest's Full Name"
              className="h-12 w-full rounded-full bg-zinc-900/50 border-zinc-800 text-zinc-100 px-6 focus-visible:ring-purple-500"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                {...form.register("primaryGuestEmail")}
                type="email"
                placeholder="Email"
                className="h-12 w-full rounded-full bg-zinc-900/50 border-zinc-800 text-zinc-100 px-6 focus-visible:ring-purple-500"
              />
              <Input
                {...form.register("primaryGuestPhone")}
                type="tel"
                placeholder="Phone"
                className="h-12 w-full rounded-full bg-zinc-900/50 border-zinc-800 text-zinc-100 px-6 focus-visible:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-[2rem] border border-zinc-800 bg-black/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-fuchsia-500" />
          <h3 className="text-sm font-semibold text-fuchsia-300 uppercase mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Guest 2
          </h3>
          <div className="space-y-4">
            <Input
              {...form.register("plusOneGuestName")}
              placeholder="Guest's Full Name"
              className="h-12 w-full rounded-full bg-zinc-900/50 border-zinc-800 text-zinc-100 px-6 focus-visible:ring-fuchsia-500"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                {...form.register("plusOneGuestEmail")}
                type="email"
                placeholder="Email"
                className="h-12 w-full rounded-full bg-zinc-900/50 border-zinc-800 text-zinc-100 px-6 focus-visible:ring-fuchsia-500"
              />
              <Input
                {...form.register("plusOneGuestPhone")}
                type="tel"
                placeholder="Phone"
                className="h-12 w-full rounded-full bg-zinc-900/50 border-zinc-800 text-zinc-100 px-6 focus-visible:ring-fuchsia-500"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 pt-4">
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

export function PlusOneStep3() {
  const { formData, prevStep, jumpToStep, parentId } = useRegistrationStore();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<PlusOneStep3Values>({
    resolver: zodResolver(stepFiveSchema),
    defaultValues: { amount: 10000, receiptUrl: formData.receiptUrl ?? "" },
  });

  const currentReceipt = useWatch({
    control: form.control,
    name: "receiptUrl",
  });

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "freelife_preset");
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/avdcnocd/image/upload",
        { method: "POST", body: data },
      );
      const result: { secure_url?: string } = await res.json();
      if (result.secure_url) {
        form.setValue("receiptUrl", result.secure_url, {
          shouldValidate: true,
        });
        toast.success("Receipt uploaded securely.");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Upload failed.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit: SubmitHandler<PlusOneStep3Values> = async (data) => {
    if (data.amount < 10000) {
      form.setError("amount", { message: "Minimum is ₦10,000" });
      return;
    }
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        amount: data.amount,
        receiptUrl: data.receiptUrl,
        eventType: "PURPLE_BALL_AND_AFTER_PARTY" as const,
        parentId: parentId ?? undefined,
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result: { error?: string } = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to submit");
      jumpToStep(4);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Submission failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 animate-in fade-in duration-700"
    >
      <div className="text-center space-y-2">
        <p className="text-sm text-zinc-400 font-light">
          Your individual contribution for the Purple Ball
        </p>
        <h2 className="text-3xl font-normal text-white">₦10,000</h2>
        <div className="pt-2 space-y-1">
          <p className="text-sm text-zinc-300">
            Bank: <span className="text-purple-400">Access Bank</span>
          </p>
          <p className="text-lg font-bold text-white">1220219041</p>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">
            Free Life Leadership Initiative
          </p>
        </div>
      </div>

      <div className="space-y-5 border-t border-white/5 pt-6">
        <div>
          <label className="px-4 text-xs text-zinc-500 uppercase block mb-2">
            Support Amount (₦)
          </label>
          <Input
            {...form.register("amount", { valueAsNumber: true })}
            type="number"
            className="h-14 w-full rounded-full bg-black/50 border-zinc-800 text-zinc-100 px-6 focus-visible:ring-purple-500 text-lg"
          />
          {form.formState.errors.amount && (
            <p className="text-rose-500 text-xs px-4 mt-2">
              {form.formState.errors.amount.message}
            </p>
          )}
        </div>

        <label
          className={`flex items-center justify-center w-full h-14 border rounded-full cursor-pointer transition-all ${currentReceipt ? "bg-purple-900/20 border-purple-500/50" : "bg-black/50 border-zinc-800 hover:bg-zinc-900"}`}
        >
          <div className="flex items-center gap-3 text-zinc-400">
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : currentReceipt ? (
              <span className="text-purple-400 flex gap-2">
                <CheckCircle2 /> Uploaded
              </span>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Payment Proof</span>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            disabled={isUploading}
            onChange={handleUpload}
          />
        </label>
        {form.formState.errors.receiptUrl && (
          <p className="text-rose-500 text-xs px-4 text-center">
            {form.formState.errors.receiptUrl.message}
          </p>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          onClick={prevStep}
          className="h-14 w-14 rounded-full bg-black/50 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="w-full h-14 rounded-full bg-white text-black font-medium text-lg"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            "Submit Registration"
          )}
        </Button>
      </div>
    </form>
  );
}
