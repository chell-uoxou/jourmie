"use client";
import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { BudgetMode } from "~/models/types/common";
import FormConfirmationItem from "./FormConfirmationItem";

interface EventFormComponentsConfirmationProps {
  name: string;
  description: string;
  location: string;
  startDateTime: Date;
  endDateTime: Date;
  duration: string;
  budgetType: BudgetMode;
  budget: string;
  isPreparationChecked: boolean;
  preparationDetails: string;
  participants: string;
  memo: string;
  onEdit: () => void;
  onSubmit: () => void;
}

export default function EventFormComponentsConfirmation({
  name,
  description,
  location,
  startDateTime,
  endDateTime,
  duration,
  budgetType,
  budget,
  isPreparationChecked,
  preparationDetails,
  participants,
  memo,
  onEdit,
  onSubmit,
}: EventFormComponentsConfirmationProps) {
  const [isTitle, setIsTitle] = useState(false);

  useEffect(() => {
    setIsTitle(!!name);
  }, [name]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <FormConfirmationItem title="名前" text={name} />
        <FormConfirmationItem title="説明" text={description} />
        <FormConfirmationItem title="場所" text={location} />
        <div className="flex flex-row gap-4">
          <FormConfirmationItem
            title="開始日時"
            text={startDateTime.toLocaleString()}
            className="flex-1"
          />
          <FormConfirmationItem
            title="終了日時"
            text={endDateTime.toLocaleString()}
            className="flex-1"
          />
        </div>
        <FormConfirmationItem title="所要時間(分)" text={duration} />
        <FormConfirmationItem
          title="予算"
          text={
            budget
              ? `${
                  budgetType === "per_person" ? "1人あたり" : "合算"
                }  ${budget}円`
              : "未設定"
          }
        />
        {isPreparationChecked && (
          <FormConfirmationItem
            title="参加への準備タスク"
            text={preparationDetails}
          />
        )}
        <FormConfirmationItem title="最大人数" text={participants} />
        <FormConfirmationItem title="メモ" text={memo} />
      </div>

      <div className="flex flex-row justify-between gap-3">
        <Button onClick={onEdit} className="flex w-full" variant="outline">
          編集
        </Button>
        <Button
          onClick={isTitle ? onSubmit : undefined}
          disabled={!isTitle}
          variant={isTitle ? "default" : "secondary"}
          className="flex w-full"
        >
          追加
        </Button>
      </div>
    </div>
  );
}
