import { BudgetMode, TimeRange } from "./common";

export default interface EventPool {
  title: string;
  description: string;
  location: string;
  attached_image: string;
  available_times: TimeRange[];
  default_duration: number;
  default_budget: {
    mode: BudgetMode;
    value: number;
  };
  needs_preparation: boolean;
  preparation_task: string;
  max_participants: number;
  notes: string;
}