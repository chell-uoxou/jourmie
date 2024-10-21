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
  // バリデーションをuseEffectで設定
  useEffect(() => {
    // 名前が空の場合はfalse
    setIsTitle(!!name);
  }, [name]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-bold">名前</h2>
      <p className="border-destructive">{name ? name : "未設定"}</p>

      <h2 className="text-sm font-bold">説明</h2>
      <p>{description ? description : "未設定"}</p>

      <h2 className="text-sm font-bold">場所</h2>
      <p>{location ? location : "未設定"}</p>

      <div className="flex flex-row gap-4">
        <div className="flex flex-col">
          <h2 className="text-sm font-bold">開始日時</h2>
          <p className="py-2">{startDateTime.toLocaleString()}</p>
        </div>
        <div className="flex flex-col">
          <h2 className="text-sm font-bold">終了日時</h2>
          <p className="py-2">{endDateTime.toLocaleString()}</p>
        </div>
      </div>
      <h2 className="text-sm font-bold">所要時間(分)</h2>
      <p>{duration ? duration : "未設定"}</p>

      <h2 className="text-sm font-bold">1人あたり/合算</h2>
      <p>{budgetType === "per_person" ? "1人あたり" : "合算"}</p>

      <h2 className="text-sm font-bold">予算</h2>
      <p>{budget ? budget + "円" : "未設定"}</p>

      {isPreparationChecked && (
        <>
          <h2 className="text-sm font-bold">参加への準備タスク</h2>
          <p>{preparationDetails ? preparationDetails : "未設定"}</p>
        </>
      )}

      <h2 className="text-sm font-bold">最大人数</h2>
      <p>{participants ? participants : "未設定"}</p>

      <h2 className="text-sm font-bold">メモ</h2>
      <p>{memo ? memo : "未設定"}</p>

      <div className="flex flex-row justify-between  gap-3">
        <Button onClick={onEdit} className="flex w-full">
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
