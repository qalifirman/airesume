import { twMerge } from "tailwind-merge";

export function cn(...classes: (string | undefined | boolean)[]) {
  return twMerge(...classes.filter(Boolean));
}
