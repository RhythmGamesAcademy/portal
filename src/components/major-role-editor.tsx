"use client";

import { useActionState, useMemo, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries/types";
import type { Locale } from "@/i18n/config";
import {
  majorRoleCodes,
  roleLabel,
  ROLE_SEARCH_ABBREVIATIONS,
  ROLE_SEARCH_ALIASES,
} from "@/lib/roles";
import { searchMatchRank } from "@/lib/search";
import { updateMajorRoles, type MajorRoleUpdateState } from "@/app/[locale]/id/actions";
import { SubmitButton } from "@/components/submit-button";

export function MajorRoleEditor({
  locale,
  dictionary,
  initialMajors,
}: {
  locale: Locale;
  dictionary: Dictionary;
  initialMajors: string[];
}) {
  const [selectedMajors, setSelectedMajors] = useState(initialMajors);
  const [search, setSearch] = useState("");
  const [state, formAction, pending] = useActionState<MajorRoleUpdateState, FormData>(
    updateMajorRoles,
    { status: "idle", selectedMajors: initialMajors },
  );
  const availableMajors = useMemo(
    () => majorRoleCodes()
      .map((code) => ({ code, label: roleLabel(code, locale) }))
      .filter((major): major is { code: string; label: string } => Boolean(major.label)),
    [locale],
  );
  const filteredMajors = availableMajors
    .map((major, index) => {
      const abbreviations = ROLE_SEARCH_ABBREVIATIONS[major.code] ?? [];
      const aliases = (ROLE_SEARCH_ALIASES[major.code] ?? [])
        .filter((alias) => !abbreviations.includes(alias));
      const rank = searchMatchRank(
        search,
        [roleLabel(major.code, "ja"), roleLabel(major.code, "en")].filter((label): label is string => Boolean(label)),
        aliases,
        abbreviations,
      );
      return { major, index, rank };
    })
    .filter((result): result is typeof result & { rank: number } => result.rank !== null)
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map(({ major }) => major);
  const selectedLabels = selectedMajors
    .map((code) => roleLabel(code, locale))
    .filter((label): label is string => Boolean(label));
  const summaryLabels = selectedLabels.slice(0, 2).join(", ");
  const remainingSelected = selectedLabels.length - Math.min(selectedLabels.length, 2);
  const stateMatchesSelection = state.selectedMajors.length === selectedMajors.length
    && state.selectedMajors.every((code) => selectedMajors.includes(code));

  const statusMessage = !stateMatchesSelection
    ? ""
    : state.status === "success"
    ? dictionary.roles.saveSuccess
    : state.error === "invalid"
      ? dictionary.roles.saveLimit
      : state.error === "unauthorized"
        ? dictionary.roles.saveUnauthorized
        : state.error === "configuration"
          ? dictionary.roles.saveConfiguration
          : state.error === "forbidden"
            ? dictionary.roles.saveForbidden
            : state.error === "not_found"
              ? dictionary.roles.saveNotFound
              : state.status === "error"
                ? dictionary.roles.saveFailure
                : "";

  return (
    <div className="space-y-5">
      <form action={formAction} className="space-y-4 border-t border-line pt-5">
        {selectedMajors.map((code) => (
          <input key={code} type="hidden" name="majors" value={code} />
        ))}
        <div className="space-y-2">
          <h3 className="text-base font-medium">{dictionary.roles.editHeading}</h3>
          <p className="text-sm text-muted">{dictionary.roles.editDescription}</p>
          <details className="group relative">
            <summary
              aria-label={`${dictionary.roles.dropdownLabel}: ${selectedLabels.join(", ") || dictionary.roles.none}, ${selectedMajors.length} ${dictionary.roles.selectionCount}`}
              className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-lg border border-line bg-surface px-3 py-2 transition-colors hover:border-accent [&::-webkit-details-marker]:hidden"
            >
              <span className="min-w-0 truncate">
                {summaryLabels || <span className="text-muted">{dictionary.roles.dropdownLabel}</span>}
                {remainingSelected > 0 && <span className="text-muted"> +{remainingSelected}</span>}
              </span>
              <span className="flex shrink-0 items-center gap-2 text-sm text-muted">
                <span aria-live="polite">{selectedMajors.length} {dictionary.roles.selectionCount}</span>
                <span aria-hidden="true" className="transition-transform group-open:rotate-180">⌄</span>
              </span>
            </summary>
            <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-line bg-surface shadow-xl">
              <label className="sticky top-0 block border-b border-line bg-surface p-2">
                <span className="sr-only">{dictionary.roles.searchPlaceholder}</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.currentTarget.value)}
                  placeholder={dictionary.roles.searchPlaceholder}
                  className="min-h-10 w-full rounded-md border border-line bg-paper px-3 text-sm text-ink placeholder:text-muted"
                />
              </label>
              <fieldset disabled={pending} className="max-h-56 overflow-y-auto p-2">
                <legend className="sr-only">{dictionary.roles.majorHeading}</legend>
                {selectedMajors.length > 5 && (
                  <p className="mb-2 rounded-md bg-notice px-2 py-1 text-xs text-warning">
                    {dictionary.roles.warningBody}
                  </p>
                )}
                {filteredMajors.length > 0 ? (
                  <div className="space-y-1">
                    {filteredMajors.map(({ code, label }) => {
                      const checked = selectedMajors.includes(code);
                      const disabled = !checked && selectedMajors.length >= 5;
                      return (
                        <label key={code} className={`flex min-h-10 items-center gap-3 rounded-md px-2 py-1 hover:bg-notice ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
                          <input
                            type="checkbox"
                            value={code}
                            checked={checked}
                            disabled={disabled}
                            onChange={(event) => {
                              const isChecked = event.currentTarget.checked;
                              setSelectedMajors((current) => isChecked
                                ? [...current, code]
                                : current.filter((selected) => selected !== code));
                            }}
                            className="size-4 shrink-0 accent-accent"
                          />
                          <span className="text-sm">{label}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <p className="px-2 py-3 text-sm text-muted">{dictionary.roles.noResults}</p>
                )}
              </fieldset>
            </div>
          </details>
        </div>
        {statusMessage && (
          <p role="status" className={state.status === "success" ? "text-success" : "text-warning"}>
            {statusMessage}
          </p>
        )}
        <SubmitButton primary pending={pending} pendingLabel={dictionary.roles.savePending}>
          {dictionary.roles.save}
        </SubmitButton>
      </form>
    </div>
  );
}
