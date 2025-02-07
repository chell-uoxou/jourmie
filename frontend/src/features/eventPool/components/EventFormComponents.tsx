"use client";
import React from "react";
import { DateTimePicker } from "~/components/ui/datetimepicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import { InputWithLabel } from "~/components/common/InputWithLabel";
import { WithLabel } from "~/components/common/WithLabel";
import { ja } from "date-fns/locale";
import { UseFormReturn } from "react-hook-form";
import { EventPoolItemForm } from "../EventInputDialog";

interface EventFormComponentsProps {
  eventForm: UseFormReturn<EventPoolItemForm>;
}

export default function EventFormComponents(props: EventFormComponentsProps) {
  const { eventForm } = props;
  const errors = eventForm.formState.errors;

  return (
    <div className="flex flex-col gap-4">
      <InputWithLabel
        label="名前"
        {...eventForm.register("title", { required: true })}
        errorText={errors.title && "イベントタイトルを入力してください"}
      />
      <InputWithLabel label="説明" {...eventForm.register("description")} />
      <InputWithLabel label="場所" {...eventForm.register("location_text")} />
      <div className="flex flex-col gap-2">
        <div className="text-sm text-left text-slate-900 font-bold">
          イベントをドロップできる範囲（会期、開館時間など）
        </div>
        <div className="flex flex-col gap-4 ml-4">
          <WithLabel label="開始日時">
            <DateTimePicker
              value={eventForm.watch("available_start_time")}
              onChange={(e) =>
                e && eventForm.setValue("available_start_time", e)
              }
              displayFormat={{ hour24: "MM/dd（eee）hh:mm" }}
              className="flex1"
              locale={ja}
            />
          </WithLabel>
          <WithLabel label="終了日時">
            <DateTimePicker
              value={eventForm.watch("available_end_time")}
              onChange={(e) => e && eventForm.setValue("available_end_time", e)}
              displayFormat={{ hour24: "MM/dd（eee）hh:mm" }}
              className="flex1"
              locale={ja}
            />
          </WithLabel>
        </div>
      </div>

      <InputWithLabel
        label="所要時間(分)"
        type="number"
        {...eventForm.register("default_duration", {
          required: true,
          validate: (value) => {
            return Number(value) >= 0 && Number.isInteger(value);
          },
          valueAsNumber: true,
        })}
      />
      <div className="flex w-full gap-2">
        <WithLabel label="1人あたり/合算">
          <Select
            onValueChange={(value) => {
              if (value === "per_person" || value === "total") {
                eventForm.setValue("default_budget_type", value);
              }
            }}
            value={eventForm.watch("default_budget_type")}
          >
            <SelectTrigger>
              <SelectValue placeholder="選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="per_person">1人あたり</SelectItem>
              <SelectItem value="total">合算</SelectItem>
            </SelectContent>
          </Select>
        </WithLabel>
        <InputWithLabel
          label="予算(円)"
          type="number"
          {...eventForm.register("default_budget", {
            required: true,
            validate: (value) => {
              return value >= 0;
            },
            valueAsNumber: true,
          })}
          errorText={errors.default_budget && "有効な予算を入力してください"}
        />
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Checkbox
          id="needs_preparation"
          checked={eventForm.watch("needs_preparation")}
          onCheckedChange={(value) =>
            eventForm.setValue("needs_preparation", value as boolean)
          }
        />
        <label
          htmlFor="needs_preparation"
          className="text-sm font-medium leading-none"
        >
          予定を確定するまでにタスクがある
        </label>
      </div>
      <InputWithLabel
        label="予定の準備タスク"
        {...eventForm.register("preparation_task")}
        disabled={!eventForm.watch("needs_preparation")}
      />
      <InputWithLabel
        label="最大人数"
        type="number"
        {...eventForm.register("max_participants", {
          validate: (value) => {
            return (value >= 1 && Number.isInteger(value)) || isNaN(value);
          },
          valueAsNumber: true,
        })}
        errorText={
          errors.max_participants && "最大人数を1以上の整数で入力してください"
        }
      />
      <WithLabel label="メモ">
        <Textarea {...eventForm.register("notes")} className="h-24" />
      </WithLabel>
    </div>
  );
}
