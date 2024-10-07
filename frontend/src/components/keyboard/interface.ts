import { UsedAlphabets } from "../../hooks/interface";

export interface KeyboardProps {
  usedAlphabets: UsedAlphabets;
  handleKeyup: (event: KeyboardEvent) => Promise<void>;
}
