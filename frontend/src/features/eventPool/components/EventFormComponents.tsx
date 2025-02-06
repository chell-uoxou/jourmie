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
import { BudgetMode } from "~/models/types/common";
import { ja } from "date-fns/locale";
import { useValidation } from "../hooks/useValidation";

interface EventFormComponentsProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  startDateTime: Date;
  setStartDateTime: React.Dispatch<React.SetStateAction<Date>>;
  endDateTime: Date;
  setEndDateTime: React.Dispatch<React.SetStateAction<Date>>;
  duration: string;
  setDuration: React.Dispatch<React.SetStateAction<string>>;
  budgetType: BudgetMode;
  setBudgetType: React.Dispatch<React.SetStateAction<BudgetMode>>;
  budget: string;
  setBudget: React.Dispatch<React.SetStateAction<string>>;
  isPreparationChecked: boolean;
  setIsPreparationChecked: React.Dispatch<React.SetStateAction<boolean>>;
  preparationDetails: string;
  setPreparationDetails: React.Dispatch<React.SetStateAction<string>>;
  participants: string;
  setParticipants: React.Dispatch<React.SetStateAction<string>>;
  memo: string;
  setMemo: React.Dispatch<React.SetStateAction<string>>;
}

export default function EventFormComponents({
  name,
  setName,
  description,
  setDescription,
  location,
  setLocation,
  startDateTime,
  setStartDateTime,
  endDateTime,
  setEndDateTime,
  duration,
  setDuration,
  setBudgetType,
  budget,
  setBudget,
  isPreparationChecked,
  setIsPreparationChecked,
  preparationDetails,
  setPreparationDetails,
  participants,
  setParticipants,
  memo,
  setMemo,
}: EventFormComponentsProps) {
  const { isValid, validate, disableError } = useValidation();

  return (
    <div className="flex flex-col gap-4">
      <InputWithLabel
        label="名前"
        name="name"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={(e) => validate("title", e.target.value)}
        onFocus={() => disableError("title")}
        className={isValid("title") ? "" : "border-red-500"}
        errorText={isValid("title") ? "" : "必須項目です。"}
      />
      <InputWithLabel
        label="説明"
        name="description"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <InputWithLabel
        label="場所"
        name="location"
        id="location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <div className="flex flex-row gap-4">
        <WithLabel label="開始日時">
          <DateTimePicker
            value={startDateTime}
            onChange={(e) => e && setStartDateTime(e)}
            displayFormat={{ hour24: "MM/dd（eee）hh:mm" }}
            className="flex1"
            locale={ja}
          />
        </WithLabel>
        <WithLabel label="終了日時">
          <DateTimePicker
            value={endDateTime}
            onChange={(e) => e && setEndDateTime(e)}
            displayFormat={{ hour24: "MM/dd（eee）hh:mm" }}
            className="flex1"
            locale={ja}
          />
        </WithLabel>
      </div>

      <InputWithLabel
        label="所要時間(分)"
        name="time"
        id="time"
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        onBlur={(e) => validate("default_duration", e.target.value)}
        onFocus={() => disableError("default_duration")}
        className={isValid("default_duration") ? "" : "border-red-500"}
        errorText={
          isValid("default_duration") ? "" : "負でない整数のみ入力できます"
        }
      />
      <div className="flex w-full gap-2">
        <WithLabel label="1人あたり/合算">
          <Select onValueChange={(value) => setBudgetType(value as BudgetMode)}>
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
          name="value"
          id="value"
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          onBlur={(e) => validate("default_budget", e.target.value)}
          onFocus={() => disableError("default_budget")}
          className={isValid("default_budget") ? "" : "border-red-500"}
          errorText={
            isValid("default_budget") ? "" : "負でない整数のみ入力できます"
          }
        />
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Checkbox
          id="preparation"
          checked={isPreparationChecked}
          onCheckedChange={(checked) =>
            setIsPreparationChecked(checked === true)
          }
        />
        <label
          htmlFor="preparation"
          className="text-sm font-medium leading-none"
        >
          予定を確定するまでにやることがある
        </label>
      </div>
      <InputWithLabel
        label="予定の準備タスク"
        name="preparation"
        id="preparation"
        placeholder="チケットを予約する"
        disabled={!isPreparationChecked}
        value={preparationDetails}
        onChange={(e) => setPreparationDetails(e.target.value)}
      />
      <InputWithLabel
        label="最大人数"
        name="participants"
        id="participants"
        type="number"
        value={participants}
        onChange={(e) => setParticipants(e.target.value)}
        onFocus={() => disableError("max_participants")}
        className={isValid("max_participants") ? "" : "border-red-500"}
        errorText={
          isValid("max_participants") ? "" : "負でない整数のみ入力できます"
        }
      />
      <WithLabel label="メモ">
        <Textarea
          name="memo"
          id="memo"
          className="h-24"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </WithLabel>
    </div>
  );
}
