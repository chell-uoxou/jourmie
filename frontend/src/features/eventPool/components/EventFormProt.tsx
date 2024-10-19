"use client";
import React, { FormEventHandler, useState } from "react";
import { Button } from "~/components/ui/button";
import { collection, Timestamp } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { useFirestoreCollection } from "~/hooks/useFirestoreCollection";
import { BudgetMode } from "~/models/types/common";
import useCurrentAccount, { isReady } from "~/hooks/useCurrentAccount";
import { DBEventPoolItem } from "~/lib/firestore/utils";
import EventFormComponents from "./EventFormComponents";
import EventFormComponentsConfirmation from "./EventFormComponentsConfirmation";

function EventForm() {
  const { currentDBAccount } = useCurrentAccount();

  const eventsCollection = isReady(currentDBAccount)
    ? collection(db, "accounts", currentDBAccount.uid, "event_pool")
    : null;
  const { add } = useFirestoreCollection<DBEventPoolItem>(eventsCollection);

  // 入力フィールドの状態管理
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

  const [isConfirmation, setIsConfirmation] = useState(false); // 確認画面の表示状態

  // 送信処理
  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    setIsConfirmation(true); // 確認画面に切り替え
  };

  // 確認画面からの実際のデータ送信
  const handleFinalSubmit = async () => {
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
      resetForm();
      setIsConfirmation(false); // 確認画面を閉じる
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  // フォームをリセット
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
    <div>
      {isConfirmation ? (
        <EventFormComponentsConfirmation
          name={name}
          description={description}
          location={location}
          startDateTime={startDateTime}
          endDateTime={endDateTime}
          duration={duration}
          budgetType={budgetType}
          budget={budget}
          isPreparationChecked={isPreparationChecked}
          preparationDetails={preparationDetails}
          participants={participants}
          memo={memo}
          onEdit={() => setIsConfirmation(false)}
          onSubmit={handleFinalSubmit}
        />
      ) : (
        <form onSubmit={handleSubmit} className="w-96 p-2">
          <div className="w-full">
            <div className="flex flex-col gap-4">
              <EventFormComponents
                name={name}
                setName={setName}
                description={description}
                setDescription={setDescription}
                location={location}
                setLocation={setLocation}
                startDateTime={startDateTime}
                setStartDateTime={setStartDateTime}
                endDateTime={endDateTime}
                setEndDateTime={setEndDateTime}
                duration={duration}
                setDuration={setDuration}
                budgetType={budgetType}
                setBudgetType={setBudgetType}
                budget={budget}
                setBudget={setBudget}
                isPreparationChecked={isPreparationChecked}
                setIsPreparationChecked={setIsPreparationChecked}
                preparationDetails={preparationDetails}
                setPreparationDetails={setPreparationDetails}
                participants={participants}
                setParticipants={setParticipants}
                memo={memo}
                setMemo={setMemo}
              />
              <div className="flex flex-row-reverse">
                <Button type="submit" className="" size={"lg"}>
                  追加
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default EventForm;
