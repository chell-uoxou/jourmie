"use client";
import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { BudgetMode } from "~/models/types/common";

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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xs font-bold">名前</h2>
          <p className="border-destructive text-sm">{name ? name : "未設定"}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-xs font-bold">説明</h2>
          <p className="text-sm">{description ? description : "未設定"}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-xs font-bold">場所</h2>
          <p className="text-sm">{location ? location : "未設定"}</p>
        </div>

        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xs font-bold">開始日時</h2>
            <p className="py-2 text-sm">{startDateTime.toLocaleString()}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xs font-bold">終了日時</h2>
            <p className="py-2 text-sm">{endDateTime.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-xs font-bold">所要時間(分)</h2>
          <p className="text-sm">{duration ? duration : "未設定"}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-xs font-bold">1人あたり/合算</h2>
          <p className="text-sm">
            {budgetType === "per_person" ? "1人あたり" : "合算"}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-xs font-bold">予算</h2>
          <p className="text-sm">{budget ? budget + "円" : "未設定"}</p>
        </div>

        {isPreparationChecked && (
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xs font-bold">参加への準備タスク</h2>
            <p className="text-sm">
              {preparationDetails ? preparationDetails : "未設定"}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <h2 className="text-xs font-bold">最大人数</h2>
          <p className="text-sm">{participants ? participants : "未設定"}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-xs font-bold">メモ</h2>
          <p className="text-sm">{memo ? memo : "未設定"}</p>
        </div>
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
