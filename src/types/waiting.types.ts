export interface WaitingState {
  id: string;
  message?: string;
  isVisible: boolean;
  overlay?: boolean; // Whether to show overlay backdrop
  size?: "small" | "medium" | "large";
  theme?: "primary" | "secondary" | "accent";
}

export interface WaitingOptions {
  message?: string;
  overlay?: boolean;
  size?: "small" | "medium" | "large";
  theme?: "primary" | "secondary" | "accent";
}

export interface WaitingServiceEvents {
  "waiting:show": (state: WaitingState) => void;
  "waiting:hide": (id: string) => void;
  "waiting:clear": () => void;
}
