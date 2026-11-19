import { create } from "zustand";
import { z } from "zod";

export const stepOneSchema = z.object({
  attendeeName: z.string().min(2, "Name is required"),
  attendeeEmail: z.string().email("Invalid email address"),
  attendeePhone: z.string().min(10, "Phone number is required"),
  eventType: z.enum(
    ["AFTER_PARTY_ONLY", "PURPLE_BALL_AND_AFTER_PARTY"] as const,
    {
      message: "Please select an experience",
    },
  ),
});

export const stepTwoSchema = z.object({
  isPlusOneReady: z.boolean({ message: "Please make a selection" }),
});

export const stepThreeSchema = z.object({
  plusOneName: z.string().min(2, "Plus One name is required"),
  plusOneEmail: z.string().email("Invalid email address"),
  plusOnePhone: z.string().min(10, "Phone number is required"),
  isFreelifer: z.boolean(),
});

export const stepFourSchema = z.object({
  primaryGuestName: z.string().optional().or(z.literal("")),
  primaryGuestEmail: z
    .union([z.string().email("Invalid email"), z.literal("")])
    .optional(),
  primaryGuestPhone: z.string().optional().or(z.literal("")),
  plusOneGuestName: z.string().optional().or(z.literal("")),
  plusOneGuestEmail: z
    .union([z.string().email("Invalid email"), z.literal("")])
    .optional(),
  plusOneGuestPhone: z.string().optional().or(z.literal("")),
});

export const stepFiveSchema = z.object({
  amount: z.number().min(10000, "Minimum support amount is ₦10,000"),
  receiptUrl: z.string().min(1, "Please upload your transfer receipt"),
});

export type RegistrationData = Partial<z.infer<typeof stepOneSchema>> &
  Partial<z.infer<typeof stepTwoSchema>> &
  Partial<z.infer<typeof stepThreeSchema>> &
  Partial<z.infer<typeof stepFourSchema>> &
  Partial<z.infer<typeof stepFiveSchema>> & {
    parentId?: string;
  };

export const plusOneDetailsSchema = z.object({
  attendeeName: z.string().min(2, "Name is required"),
  attendeeEmail: z.string().email("Invalid email address"),
  attendeePhone: z.string().min(10, "Phone number is required"),
  isFreelifer: z.boolean({ message: "Please select an option" }),
});

interface RegistrationStore {
  currentStep: number;
  formData: RegistrationData;
  isPlusOneFlow: boolean;
  inviterName: string | null;
  parentId: string | null;
  setPlusOneMode: (name: string, id: string) => void;
  setFormData: (data: Partial<RegistrationData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  jumpToStep: (step: number) => void;
  reset: () => void;
}

export const useRegistrationStore = create<RegistrationStore>((set) => ({
  currentStep: 1,
  formData: {
    isFreelifer: false,
  },
  isPlusOneFlow: false,
  inviterName: null,
  parentId: null,
  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  nextStep: () =>
    set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
  prevStep: () =>
    set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  jumpToStep: (step) => set({ currentStep: step }),
  reset: () =>
    set({
      currentStep: 1,
      formData: { isFreelifer: false },
    }),
  setPlusOneMode: (name, id) =>
    set({ isPlusOneFlow: true, inviterName: name, parentId: id }),
}));
