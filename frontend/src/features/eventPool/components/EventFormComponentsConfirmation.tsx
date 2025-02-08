"use client";
import FormConfirmationItem from "./FormConfirmationItem";
import { UseFormReturn } from "react-hook-form";
import { EventPoolItemForm } from "../EventInputDialog";

interface EventFormComponentsConfirmationProps {
  eventForm: UseFormReturn<EventPoolItemForm>;
}

export default function EventFormComponentsConfirmation({
  eventForm,
}: EventFormComponentsConfirmationProps) {
  const {
    title,
    description,
    location_text,
    available_start_time,
    available_end_time,
    default_duration,
    default_budget,
    default_budget_type,
    needs_preparation,
    preparation_task,
    max_participants,
    notes,
  } = eventForm.getValues();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <FormConfirmationItem title="名前" text={title} />
        <FormConfirmationItem title="説明" text={description} />
        <FormConfirmationItem title="場所" text={location_text} />
        <div className="flex flex-row gap-4">
          <FormConfirmationItem
            title="開始日時"
            text={available_start_time.toLocaleString()}
            className="flex-1"
          />
          <FormConfirmationItem
            title="終了日時"
            text={available_end_time.toLocaleString()}
            className="flex-1"
          />
        </div>
        <FormConfirmationItem
          title="所要時間(分)"
          text={default_duration.toString()}
        />
        <FormConfirmationItem
          title="予算"
          text={
            default_budget !== null
              ? `${
                  default_budget_type === "per_person" ? "1人あたり" : "合算"
                }  ${default_budget}円`
              : "未設定"
          }
        />
        {needs_preparation && (
          <FormConfirmationItem
            title="参加への準備タスク"
            text={preparation_task}
          />
        )}
        <FormConfirmationItem
          title="最大人数"
          text={!max_participants ? "未設定" : max_participants.toString()}
        />
        <FormConfirmationItem title="メモ" text={notes} />
      </div>
    </div>
  );
}
