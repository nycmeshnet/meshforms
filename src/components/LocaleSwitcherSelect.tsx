"use client";

import clsx from "clsx";
import { useParams } from "next/navigation";
import { ChangeEvent, ReactNode, useTransition } from "react";
import { Locale, usePathname, useRouter } from "@/i18n/routing";
import { Select, SelectChangeEvent } from "@mui/material";

type Props = {
  children: ReactNode;
  defaultValue: string;
  label: string;
};

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
  label,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(event: SelectChangeEvent) {
    const nextLocale = event.target.value as Locale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale },
      );
    });
  }

  return (
    <label
      className={clsx(
        "relative text-gray-400",
        isPending && "transition-opacity [&:disabled]:opacity-30",
      )}
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <p className="sr-only" style={{ paddingRight: "10px" }}>
          {label}:
        </p>
        <Select
          native={true}
          defaultValue={defaultValue}
          disabled={isPending}
          onChange={onSelectChange}
          id="joinform-locale-switcher-select"
        >
          {children}
        </Select>
      </div>
    </label>
  );
}
