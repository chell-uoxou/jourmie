"use client";
import React from "react";
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
  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-bold mb-4">確認画面</h2>
      <p>
        <strong>名前:</strong> {name}
      </p>
      <p>
        <strong>説明:</strong> {description}
      </p>
      <p>
        <strong>場所:</strong> {location}
      </p>
      <p>
        <strong>開始日時:</strong> {startDateTime.toLocaleString()}
      </p>
      <p>
        <strong>終了日時:</strong> {endDateTime.toLocaleString()}
      </p>
      <p>
        <strong>所要時間:</strong> {duration} 分
      </p>
      <p>
        <strong>予算タイプ:</strong>{" "}
        {budgetType === "per_person" ? "1人あたり" : "合算"}
      </p>
      <p>
        <strong>予算:</strong> {budget} 円
      </p>
      <p>
        <strong>準備が必要:</strong> {isPreparationChecked ? "はい" : "いいえ"}
      </p>
      {isPreparationChecked && (
        <p>
          <strong>準備タスク:</strong> {preparationDetails}
        </p>
      )}
      <p>
        <strong>最大人数:</strong> {participants}
      </p>
      <p>
        <strong>メモ:</strong> {memo}
      </p>

      <div className="flex gap-4 mt-4">
        <button onClick={onEdit} className="btn">
          編集
        </button>
        <button onClick={onSubmit} className="btn btn-primary">
          追加
        </button>
      </div>
    </div>
  );
}
