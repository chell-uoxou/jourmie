/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { DBEventPoolItem } from "~/lib/firestore/utils";

type Validation<T extends keyof DBEventPoolItem> = {
  key: T;
  validator: (value: any) => boolean;
};

const createValidation = <T extends keyof DBEventPoolItem>(
  key: T,
  validator: Validation<T>["validator"]
): Validation<T> => {
  return { key, validator };
};

export const useValidation = () => {
  const [validFields, setValidFields] = useState<(keyof DBEventPoolItem)[]>([
    "title",
    "default_duration",
    "default_budget",
    "max_participants",
  ]);

  const validations = [
    createValidation("title", (value) => {
      return value.length > 0;
    }),
    createValidation("default_duration", (value) => {
      return Number(value) >= 0 && Number.isInteger(Number(value));
    }),
    createValidation("default_budget", (value) => {
      return Number(value) >= 0 && Number.isInteger(Number(value));
    }),
    createValidation("max_participants", (value) => {
      return Number(value) >= 0 && Number.isInteger(Number(value));
    }),
  ];

  const validateAll = (eventPoolItem: DBEventPoolItem) => {
    validations.forEach((validation) => {
      setValidFields((prev) =>
        validation.validator(eventPoolItem[validation.key])
          ? [...prev, validation.key]
          : prev.filter((field) => field !== validation.key)
      );
    });

    return validations.every((validation) => validation.validator);
  };

  const validate = <T extends keyof DBEventPoolItem>(key: T, value: any) => {
    const validation = validations.find((v) => v.key === key);
    if (!validation) {
      return false;
    }
    setValidFields((prev) =>
      validation.validator(value as any)
        ? prev.includes(key)
          ? prev
          : [...prev, key]
        : prev.filter((field) => field !== key)
    );
    return validation.validator;
  };

  const isValid = (field: keyof DBEventPoolItem) => {
    console.log(validFields);
    return validFields.includes(field);
  };

  const disableError = (field: keyof DBEventPoolItem) => {
    setValidFields((prev) => (prev.includes(field) ? prev : [...prev, field]));
  };

  return { validateAll, validate, isValid, disableError };
};
