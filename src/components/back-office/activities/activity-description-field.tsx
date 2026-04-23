"use client";

import { useMemo, useState } from "react";

type ActivityDescriptionFieldProps = {
  id: string;
  name: string;
  labelClassName: string;
  inputClassName: string;
  maxLength: number;
  defaultValue?: string;
};

export function ActivityDescriptionField({
  id,
  name,
  labelClassName,
  inputClassName,
  maxLength,
  defaultValue = "",
}: ActivityDescriptionFieldProps) {
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
        Description courte{" "}
        <span className="font-normal text-gray-500">
          ({maxLength} caractères max.)
        </span>
      </label>
      <textarea
        id={id}
        name={name}
        required
        maxLength={maxLength}
        rows={3}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        className={`${inputClassName} resize-y min-h-20`}
        placeholder="Résumé affiché dans les listes"
        aria-describedby={`${id}-help`}
      />
      <p id={`${id}-help`} className={helpClassName}>
        {count}/{maxLength}
      </p>
    </div>
  );
}
