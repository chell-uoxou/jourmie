"use client";
import React, { FormEventHandler, useState } from "react";
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
import { Button } from "~/components/ui/button";

import { collection, Timestamp } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { useFirestoreCollection } from "~/hooks/useFirestoreCollection";
import { BudgetMode } from "~/models/types/common";
import useCurrentAccount, { isReady } from "~/hooks/useCurrentAccount";
import { InputWithLabel } from "~/components/common/InputWithLabel";
import { WithLabel } from "~/components/common/WithLabel";
import { DBEventPoolItem } from "~/lib/firestore/utils";

function EventForm() {
  const { currentDBAccount } = useCurrentAccount();
  console.log(currentDBAccount);

  const eventsCollection = isReady(currentDBAccount)
    ? collection(db, "accounts", currentDBAccount.uid, "event_pool")
    : null;
  const { add } = useFirestoreCollection<DBEventPoolItem>(eventsCollection);

  // 各入力フィールドの状態を管理
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [duration, setDuration] = useState("");
  const [budgetType, setBudgetType] = useState<BudgetMode>("per_person");
  const [budget, setBudget] = useState("");
  const [isPreparationChecked, setIsPreparationChecked] = useState(false);
  const [preparationDetails, setPreparationDetails] = useState("");
  const [participants, setParticipants] = useState("");
  const [memo, setMemo] = useState("");

  const handleCheckboxChange = (checked: boolean) => {
    setIsPreparationChecked(checked);
  };

  // ステップ2: フォームの送信処理
  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    const sendData: Parameters<typeof add>[0] = {
      title: name,
      description: description,
      location_text: location,
      location_coordinates: null, // TODO: 位置情報の取得
      attached_image: "",
      available_times: [
        {
          start_time: Timestamp.fromDate(startDateTime),
          end_time: Timestamp.fromDate(endDateTime),
        },
      ],
      default_duration: Number(duration),
      default_budget: {
        mode: budgetType,
        value: Number(budget),
      },
      needs_preparation: isPreparationChecked,
      preparation_task: isPreparationChecked ? preparationDetails : "",
      max_participants: Number(participants),
      notes: memo,
      schedule_instances: [],
    };

    try {
      await add(sendData);
      alert("イベントが正常に追加されました！");
      // フォームをリセット
      resetForm();
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setLocation("");
    setStartDateTime(new Date());
    setEndDateTime(new Date());
    setDuration("");
    setBudgetType("per_person");
    setBudget("");
    setIsPreparationChecked(false);
    setPreparationDetails("");
    setParticipants("");
    setMemo("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-96 p-2">
      <div className="w-full">
        <div className="flex flex-col gap-4">
          <InputWithLabel
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="名前"
          />
          <InputWithLabel
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            label="説明"
          />
          <InputWithLabel
            label="場所"
            name="location"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          {/* <div className="flex flex-col w-full gap-2"> */}
          <p className="font-bold text-lg mt-2">参加できる時間</p>
          <WithLabel label="開始日時">
            <DateTimePicker
              value={startDateTime}
              onChange={(e) => e && setStartDateTime(e)}
            />
          </WithLabel>
          <WithLabel label="終了日時">
            <DateTimePicker
              value={endDateTime}
              onChange={(e) => e && setEndDateTime(e)}
            />
          </WithLabel>
          {/* </div> */}
          <InputWithLabel
            label="所要時間(分)"
            name="time"
            id="time"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <div className="flex w-full gap-2">
            <WithLabel label="1人あたり/合算">
              <Select
                onValueChange={(value) => setBudgetType(value as BudgetMode)}
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
              name="value"
              id="value"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          {/* <div className="text-sm text-left mt-12">準備が必要な場合は記述</div> */}

          <div className="flex items-center gap-2 mt-4">
            <Checkbox
              id="preparation"
              checked={isPreparationChecked}
              onCheckedChange={handleCheckboxChange}
            />
            <label
              htmlFor="preparation"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              予定を確定するまでにやることがある
            </label>
          </div>
          <InputWithLabel
            label="予定の準備タスク"
            name="preparation"
            id="preparation"
            className="flex-grow-2"
            placeholder="チケットを予約する"
            disabled={!isPreparationChecked}
            value={preparationDetails}
            onChange={(e) => setPreparationDetails(e.target.value)}
          />
          <InputWithLabel
            label="最大人数"
            name="participants"
            id="participants"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
          />
          <WithLabel label="メモ">
            <Textarea
              name="memo"
              id="memo"
              className=" h-24"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </WithLabel>
          <div className="flex flex-row-reverse">
            <Button type="submit" className="" size={"lg"}>
              追加
            </Button>
            {/* <Button
              type="button"
              variant="destructive"
              className="mr-4"
              onClick={resetForm}
            >
              キャンセル
            </Button> */}
          </div>
        </div>
      </div>
    </form>
  );
}

export default EventForm;
