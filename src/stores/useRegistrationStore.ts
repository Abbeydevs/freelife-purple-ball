import { create } from "zustand";
import { z } from "zod";

export const stepOneSchema = z.object({
  attendeeName: z.string().min(2, "Name is required"),
  attendeeEmail: z.string().email("Invalid email address"),
  attendeePhone: z.string().min(10, "Phone number is required"),
  amount: z.number().min(10000, "Minimum support amount is ₦10,000"),
  receiptUrl: z.string().min(1, "Please upload your transfer receipt"),
});

export const stepTwoSchema = z.object({
  eventType: z.enum(["AFTER_PARTY_ONLY", "PURPLE_BALL_AND_AFTER_PARTY"], {
    message: "Please select the experience you are attending",
  }),
});

export const stepThreeSchema = z.object({
  plusOneName: z.string().min(2, "Plus One name is required"),
  plusOneEmail: z.string().email("Invalid email address"),
  plusOnePhone: z.string().min(10, "Phone number is required"),
  isFreelifer: z.boolean(),
});

export const stepFourSchema = z.object({
  primaryGuestName: z.string().min(2, "Guest name is required"),
  primaryGuestEmail: z.string().email("Invalid email address"),
  primaryGuestPhone: z.string().min(10, "Phone number is required"),

  plusOneGuestName: z.string().min(2, "Guest name is required"),
  plusOneGuestEmail: z.string().email("Invalid email address"),
  plusOneGuestPhone: z.string().min(10, "Phone number is required"),
});

export type RegistrationData = Partial<z.infer<typeof stepOneSchema>> &
  Partial<z.infer<typeof stepTwoSchema>> &
  Partial<z.infer<typeof stepThreeSchema>> &
  Partial<z.infer<typeof stepFourSchema>>;

interface RegistrationStore {
  currentStep: number;
  formData: RegistrationData;
  setFormData: (data: Partial<RegistrationData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  jumpToStep: (step: number) => void;
  reset: () => void;
}

export const useRegistrationStore = create<RegistrationStore>((set) => ({
  currentStep: 1,

  formData: {
    amount: 10000,
    isFreelifer: false,
  },

  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),

  nextStep: () =>
    set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),

  prevStep: () =>
    set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  jumpToStep: (step) => set({ currentStep: step }),

  reset: () =>
    set({
      currentStep: 1,
      formData: { amount: 10000, isFreelifer: false },
    }),
}));
