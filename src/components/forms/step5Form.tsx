"use client";

import { useState, ChangeEvent } from "react";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useRegistrationStore,
  stepFiveSchema,
} from "@/stores/useRegistrationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

type Step5FormValues = z.infer<typeof stepFiveSchema>;

export default function Step5Form() {
  const { formData, prevStep, jumpToStep } = useRegistrationStore();
  const [isUploadingReceipt, setIsUploadingReceipt] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const requiredAmount =
    formData.eventType === "PURPLE_BALL_AND_AFTER_PARTY" &&
    formData.isPlusOneReady
      ? 20000
      : 10000;

  const form = useForm<Step5FormValues>({
    resolver: zodResolver(stepFiveSchema),
    defaultValues: {
      amount: formData.amount ?? requiredAmount,
      receiptUrl: formData.receiptUrl ?? "",
    },
  });

  const currentReceiptUrl = useWatch({
    control: form.control,
    name: "receiptUrl",
  });

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingReceipt(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "freelife_preset");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/avdcnocd/image/upload",
        {
          method: "POST",
          body: data,
        },
      );
      const result = await response.json();

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
        toast.error(`Upload error: ${error.message}`);
      } else {
        toast.error("Failed to upload receipt. Please try again.");
      }
    } finally {
      setIsUploadingReceipt(false);
    }
  };

  const onSubmit: SubmitHandler<Step5FormValues> = async (data) => {
    if (data.amount < requiredAmount) {
      form.setError("amount", {
        message: `Minimum support is ₦${requiredAmount.toLocaleString()}`,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ...data }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      toast.success("Reservation complete.");
      jumpToStep(6);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred during submission.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700"
    >
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-zinc-400 font-light">
            {requiredAmount === 20000
              ? "For you and your Plus One, please make a combined contribution of at least"
              : "To support the movement, please make a contribution of at least"}
          </p>
          <h2 className="text-3xl font-normal text-white tracking-tight">
            ₦{requiredAmount.toLocaleString()}
          </h2>
          <div className="pt-2 space-y-1">
            <p className="text-sm font-medium text-zinc-300">
              Bank: <span className="text-purple-400">Access Bank</span>
            </p>
            <p className="text-lg font-bold tracking-widest text-white">
              1220219041
            </p>
            <p className="text-xs font-light text-zinc-500 uppercase tracking-widest">
              Free Life Leadership Initiative
            </p>
          </div>
        </div>

        <div className="space-y-5 border-t border-white/5 pt-6">
          <div>
            <label className="px-4 text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
              Support Amount (₦)
            </label>
            <Input
              {...form.register("amount", { valueAsNumber: true })}
              type="number"
              className="h-14 w-full rounded-full bg-black/50 border-zinc-800 text-zinc-100 px-6 font-light focus-visible:ring-1 focus-visible:ring-purple-500 text-lg"
            />
            {form.formState.errors.amount && (
              <p className="text-rose-500 text-xs px-4 mt-2">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>

          <label
            className={`flex items-center justify-center w-full h-14 border border-zinc-800 rounded-full cursor-pointer transition-all duration-300 group ${currentReceiptUrl ? "bg-purple-900/20 border-purple-500/50" : "bg-black/50 hover:bg-zinc-900"}`}
          >
            <div className="flex items-center gap-3 text-zinc-400 group-hover:text-white">
              {isUploadingReceipt ? (
                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
              ) : currentReceiptUrl ? (
                <span className="text-purple-400 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Receipt Uploaded
                </span>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span className="font-light text-sm tracking-wide">
                    Upload Payment Proof
                  </span>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              disabled={isUploadingReceipt}
              onChange={handleFileUpload}
            />
          </label>
          {form.formState.errors.receiptUrl && (
            <p className="text-rose-500 text-xs px-4 text-center">
              {form.formState.errors.receiptUrl.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-white/5">
        <Button
          type="button"
          onClick={() => {
            if (formData.eventType === "AFTER_PARTY_ONLY") jumpToStep(1);
            else if (formData.isPlusOneReady === false) jumpToStep(2);
            else prevStep();
          }}
          className="h-14 w-14 rounded-full bg-black/50 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 p-0 shrink-0 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting || isUploadingReceipt}
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
