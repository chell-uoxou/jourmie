"use client";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { InputWithLabel } from "~/components/common/InputWithLabel";
import { WithLabel } from "~/components/common/WithLabel";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
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
    <div className="flex flex-col">
      <h2 className="text-lg font-bold mb-4">確認画面</h2>
      <InputWithLabel
        label="名前"
        name="name"
        id="name"
        value={name}
        readOnly
        className={clsx(isTitle ? "" : "border-destructive")}
      />
      <p className="text-sm text-destructive">
        イベントを作るのに名前は必要です。
      </p>
      <InputWithLabel
        label="説明"
        name="description"
        id="description"
        value={description}
        readOnly
      />
      <InputWithLabel
        label="場所"
        name="location"
        id="location"
        value={location}
        readOnly
      />
      <p className="font-bold text-lg mt-2">参加できる時間</p>
      <WithLabel label="開始日時">
        <p className="py-2">{startDateTime.toLocaleString()}</p>
      </WithLabel>
      <WithLabel label="終了日時">
        <p className="py-2">{endDateTime.toLocaleString()}</p>
      </WithLabel>
      <InputWithLabel
        label="所要時間(分)"
        name="time"
        id="time"
        type="number"
        value={duration}
        readOnly
      />
      <div className="flex w-full gap-2">
        <WithLabel label="1人あたり/合算">
          <p className="py-2">
            {budgetType === "per_person" ? "1人あたり" : "合算"}
          </p>
        </WithLabel>
        <InputWithLabel
          label="予算(円)"
          name="value"
          id="value"
          type="number"
          value={budget}
          readOnly
        />
      </div>
      <div className="flex items-center gap-2 mt-4">
        <label className="text-sm font-medium leading-none">
          予定を確定するまでにやることがある:
        </label>
        <p>{isPreparationChecked ? "はい" : "いいえ"}</p>
      </div>
      {isPreparationChecked && (
        <InputWithLabel
          label="予定の準備タスク"
          name="preparation"
          id="preparation"
          value={preparationDetails}
          readOnly
        />
      )}
      <InputWithLabel
        label="最大人数"
        name="participants"
        id="participants"
        type="number"
        value={participants}
        readOnly
      />
      <WithLabel label="メモ">
        <Textarea
          name="memo"
          id="memo"
          className="h-24"
          value={memo}
          readOnly
        />
      </WithLabel>

      <div className="flex flex-row justify-between p-4 gap-3">
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
