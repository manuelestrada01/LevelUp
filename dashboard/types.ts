import { FormativeClass } from "@/clases-formativas/types";

export type Subject = "rep1" | "rep2" | "rep3";

export interface Student {
  id: string;
  name: string;
  level: number;
  formativeClass: FormativeClass;
  xp: number;
  xpNextLevel: number;
  xpCurrentLevel: number;
  strikes: number;
  activeSubject: Subject;
}
