"use client";

import { Search } from "lucide-react";

const inputClassName =
  "w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-700 outline-hidden transition placeholder:text-gray-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100";

type AdminSearchInputBaseProps = {
  placeholder: string;
  autoComplete?: string;
};

type AdminSearchInputControlledProps = AdminSearchInputBaseProps & {
  value: string;
  onChange: (nextValue: string) => void;
  name?: undefined;
  defaultValue?: undefined;
};

type AdminSearchInputNativeProps = AdminSearchInputBaseProps & {
  name: string;
  defaultValue?: string;
  value?: undefined;
  onChange?: undefined;
};

export type AdminSearchInputProps =
  | AdminSearchInputControlledProps
  | AdminSearchInputNativeProps;

export function AdminSearchInput(props: AdminSearchInputProps) {
  const { placeholder, autoComplete = "off" } = props;

  return (
    <div className="relative w-full max-w-none sm:max-w-md">
      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />
      {"name" in props && props.name !== undefined ? (
        <input
          type="search"
          name={props.name}
          defaultValue={props.defaultValue}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={inputClassName}
        />
      ) : (
        <input
          type="search"
          value={props.value}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={inputClassName}
          onChange={(event) => {
            props.onChange(event.target.value);
          }}
        />
      )}
    </div>
  );
}
