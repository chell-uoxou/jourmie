"use client";
import React, { useEffect } from "react";
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
import { Button } from "~/components/ui/button";
import { Search } from "lucide-react";
import RegisteredPreciseLocation from "./RegisteredPreciseLocation";
import { useMapWidget } from "~/hooks/useMapWidget";

interface EventFormComponentsProps {
  eventForm: UseFormReturn<EventPoolItemForm>;
}

export default function EventFormComponents(props: EventFormComponentsProps) {
  const { eventForm } = props;
  const errors = eventForm.formState.errors;
  const { focusMapSearchBox, redirectInputRef, setRedirectHandler } =
    useMapWidget();

  const formatDuration = (duration: number) => {
    const hour = Math.floor(duration / 60);
    const minute = duration % 60;
    return (hour > 0 ? hour + "時間" : "") + (minute > 0 ? minute + "分" : "");
  };

  const handleClickSearchLocation = () => {
    focusMapSearchBox(eventForm.getValues("location_text"));
  };

  const { ref: locationTextFormRef, ...locationTextFormProps } =
    eventForm.register("location_text");

  useEffect(() => {
    setRedirectHandler((location) => {
      eventForm.setValue("location_coordinate_lat", location.location.lat);
      eventForm.setValue("location_coordinate_lon", location.location.lng);
      console.log(location);
      if (location.value) eventForm.setValue("location_text", location.value);
    });
  }, [eventForm, redirectInputRef, setRedirectHandler]);

  return (
    <div className="flex flex-col gap-4">
      <InputWithLabel
        label="タイトル"
        {...eventForm.register("title", { required: true })}
        errorText={errors.title && "イベントタイトルを入力してください"}
      />
      <WithLabel label="説明">
        <Textarea {...eventForm.register("description")} className="h-12" />
      </WithLabel>
      <div className="flex flex-col gap-2">
        <InputWithLabel
          label="場所"
          {...locationTextFormProps}
          ref={(e) => {
            locationTextFormRef(e);
            redirectInputRef.current = e;
          }}
          rightElement={
            <Button
              type="button"
              size={"icon"}
              onClick={handleClickSearchLocation}
            >
              <Search />
            </Button>
          }
        />

        {eventForm.watch("location_coordinate_lat") &&
          eventForm.watch("location_coordinate_lon") && (
            <RegisteredPreciseLocation label="選択された地点" />
          )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-left text-slate-900 font-bold">
          イベントをドロップできる範囲（会期、開館時間など）
        </div>
        <div className="flex flex-col gap-4 ml-4">
          <WithLabel label="開始日時">
            <DateTimePicker
              {...eventForm.register("available_start_time", {
                validate: (value) => {
                  return (
                    value instanceof Date &&
                    eventForm.getValues("available_end_time") > value
                  );
                },
              })}
              value={eventForm.watch("available_start_time")}
              onChange={(e) =>
                e && eventForm.setValue("available_start_time", e)
              }
              displayFormat={{ hour24: "M/d（eee）HH:mm" }}
              locale={ja}
            />
            {errors.available_start_time ? (
              <div className="text-red-500 text-sm">
                終了日時より前の有効な開始日時を入力してください
              </div>
            ) : null}
          </WithLabel>
          <WithLabel label="終了日時">
            <DateTimePicker
              {...eventForm.register("available_end_time", {
                validate: (value) => {
                  return (
                    value instanceof Date &&
                    eventForm.getValues("available_start_time") < value
                  );
                },
              })}
              value={eventForm.watch("available_end_time")}
              onChange={(e) => e && eventForm.setValue("available_end_time", e)}
              displayFormat={{ hour24: "M/d（eee）HH:mm" }}
              locale={ja}
            />
            {errors.available_end_time ? (
              <div className="text-red-500 text-sm">
                開始日時より後の有効な終了日時を入力してください
              </div>
            ) : null}
          </WithLabel>
        </div>
      </div>
      <div className="flex gap-2 w-full">
        <div className="w-1/3">
          <InputWithLabel
            label="所要時間(分)"
            type="number"
            step={15}
            min={0}
            {...eventForm.register("default_duration", {
              validate: (value) => {
                return (
                  (Number(value) >= 0 && Number.isInteger(value)) ||
                  isNaN(value)
                );
              },
              valueAsNumber: true,
            })}
            errorText={
              errors.default_duration && "有効な所要時間を入力してください"
            }
          />
        </div>
        <div className="flex-1 flex items-end justify-center">
          <span className="h-10 flex items-center text-base text-slate-900">
            {formatDuration(eventForm.watch("default_duration"))}
          </span>
        </div>
      </div>
      <div className="flex w-full gap-2">
        <div className="w-1/3">
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
        </div>
        <InputWithLabel
          label="予算(円)"
          type="number"
          step={100}
          min={0}
          {...eventForm.register("default_budget", {
            validate: (value) => {
              return value >= 0 || isNaN(value);
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
          className="text-sm font-bold leading-none "
        >
          予定を確定するまでにタスクがある
        </label>
      </div>
      {eventForm.watch("needs_preparation") && (
        <InputWithLabel
          label="予定の準備タスク"
          {...eventForm.register("preparation_task")}
        />
      )}
      <InputWithLabel
        label="最大人数"
        type="number"
        step={1}
        min={1}
        {...eventForm.register("max_participants", {
          validate: (value) => {
            return (value >= 1 && Number.isInteger(value)) || isNaN(value);
          },
          valueAsNumber: true,
        })}
        errorText={
          errors.max_participants && "1人以上の最大人数を入力してください"
        }
      />
      <WithLabel label="メモ（URL、注意事項など）">
        <Textarea {...eventForm.register("notes")} className="h-24" />
      </WithLabel>
    </div>
  );
}
