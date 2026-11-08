"use client";

import { useState, ChangeEvent } from "react";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useRegistrationStore,
  stepOneSchema,
} from "@/stores/useRegistrationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Step1FormValues = z.infer<typeof stepOneSchema>;

export default function Step1Form() {
  const { formData, setFormData, nextStep } = useRegistrationStore();
  const [isUploadingReceipt, setIsUploadingReceipt] = useState<boolean>(false);

  const form = useForm<Step1FormValues>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      attendeeName: formData.attendeeName ?? "",
      attendeeEmail: formData.attendeeEmail ?? "",
      attendeePhone: formData.attendeePhone ?? "",
      amount: formData.amount ?? 10000,
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
        toast.success("Receipt uploaded beautifully.");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload receipt. Please try again.");
    } finally {
      setIsUploadingReceipt(false);
    }
  };

  const onSubmit: SubmitHandler<Step1FormValues> = (data) => {
    setFormData(data);
    nextStep();
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

      <div className="pt-4 border-t border-white/5 space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-zinc-400 font-light">
            To support the movement, please make a transfer of at least
          </p>
          <h2 className="text-3xl font-normal text-white tracking-tight">
            ₦10,000
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

        <div className="space-y-5">
          <div>
            <label className="px-4 text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
              Support Amount (₦)
            </label>
            <Input
              {...form.register("amount")}
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
                  ✓ Receipt Uploaded
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

      <Button
        type="submit"
        disabled={isUploadingReceipt}
        className="w-full h-14 rounded-full bg-white text-black hover:bg-zinc-200 font-medium text-lg mt-8 flex items-center justify-center gap-2"
      >
        Continue <ArrowRight className="w-5 h-5" />
      </Button>
    </form>
  );
}
