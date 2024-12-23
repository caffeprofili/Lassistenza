"use client";

import * as React from "react";
import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";
import { Input, type InputProps } from "./input";

export const SearchInput = React.forwardRef<
  HTMLInputElement,
  InputProps & {
    name: string;
  }
>((props, ref) => {
  const [searchQuery, setSearchQuery] = useQueryState(props.name, {
    defaultValue: "",
    shallow: false,
    clearOnDefault: true,
  });
  const useDebounced = useDebouncedCallback((v) => {
    return setSearchQuery(v);
  }, 300);

  return (
    <Input
      ref={ref}
      placeholder="Cerca..."
      type="search"
      defaultValue={searchQuery}
      onChange={(e) => useDebounced(e.target.value)}
      {...props}
    />
  );
});
