"use client";

import { Search } from "lucide-react";

type UsersSearchInputProps = {
  value: string;
  onChange: (nextValue: string) => void;
};

export function UsersSearchInput({ value, onChange }: UsersSearchInputProps) {
  return (
    <div className="relative max-w-none sm:max-w-md">
      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        placeholder="Rechercher par nom, email ou téléphone..."
        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-700 outline-hidden transition placeholder:text-gray-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
      />
    </div>
  );
}
