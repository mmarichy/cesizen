"use client";

import { useMemo, useState } from "react";

type ActivityTitleFieldProps = {
  id: string;
  name: string;
  labelClassName: string;
  inputClassName: string;
  maxLength: number;
  defaultValue?: string;
};

export function ActivityTitleField({
  id,
  name,
  labelClassName,
  inputClassName,
  maxLength,
  defaultValue = "",
}: ActivityTitleFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const count = value.length;
  const helpClassName = useMemo(() => {
    if (count >= maxLength) {
      return "mt-1 text-xs text-red-600";
    }

    if (count >= Math.floor(maxLength * 0.85)) {
      return "mt-1 text-xs text-amber-600";
    }

    return "mt-1 text-xs text-gray-500";
  }, [count, maxLength]);

  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        Titre{" "}
        <span className="font-normal text-gray-500">
          ({maxLength} caractères max.)
        </span>
      </label>
      <input
        id={id}
        name={name}
        type="text"
        required
        minLength={3}
        maxLength={maxLength}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        className={inputClassName}
        placeholder="Titre de l'activité"
        aria-describedby={`${id}-help`}
      />
      <p id={`${id}-help`} className={helpClassName}>
        {count}/{maxLength}
      </p>
    </div>
  );
}
