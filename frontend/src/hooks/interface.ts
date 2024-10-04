export interface CharacterWithValidation {
  character: string;
  validateResult: "correct" | "present" | "absent";
}
