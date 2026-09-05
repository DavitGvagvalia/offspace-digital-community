import React, { useState } from "react";

type PreferenceOption = {
  language: string;
  time: string;
  duration: string;
};

const preferences = [
  {
    id: "language",
    title: "Lessons Language",
    key: "language",
    options: ["English", "Russian", "Georgian"],
  },
  {
    id: "time",
    title: "Lesson Time",
    key: "time",
    options: ["Morning", "Afternoon", "Evening"],
  },
  {
    id: "duration",
    title: "Lesson Duration",
    key: "duration",
    options: ["1 hour", "2 hours"],
  },
] as const;


function OptionCard({
  option,
  preferenceKey,
  selected,
  setSelected,
}: {
  option: string;
  preferenceKey: keyof PreferenceOption;
  selected: PreferenceOption;
  setSelected: React.Dispatch<React.SetStateAction<PreferenceOption>>;
}) {
  const isSelected = option === selected[preferenceKey];

  return (
    <button
      type="button"
      className={`flex items-center gap-1 p-4 text-sm font-medium border rounded-sm transition ${
        isSelected
          ? "text-ink border-stone-400 bg-ivory"
          : "text-ink-soft border-stone-200 bg-ivory-light"
      }`}
      onClick={() =>
        setSelected((prev) => ({
          ...prev,
          [preferenceKey]: option,
        }))
      }
    >
      {option}
    </button>
  );
}


function PreferenceCard() {
  const defaultOption: PreferenceOption = {
    language: "",
    time: "",
    duration: "",
  };

  const [selected, setSelected] = useState(defaultOption);

  return (
    <div className="flex flex-col gap-4">

      {preferences.map((preference) => (
        <div 
          key={preference.id} 
          className="flex flex-col gap-2"
        >
          <h3 className="font-medium">
            {preference.title}
          </h3>

          <div className="flex justify-between gap-4 text-xs font-bold text-forest rounded-sm border border-dashed border-sage-300 bg-ivory-light p-4">
            {preference.options.map((option) => (
              <OptionCard
                key={option}
                option={option}
                preferenceKey={preference.key}
                selected={selected}
                setSelected={setSelected}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="mt-4 rounded border p-4">
        <h3 className="font-bold mb-2">
          Selected Preferences:
        </h3>

        <pre>
          {JSON.stringify(selected, null, 2)}
        </pre>
      </div>

    </div>
  );
}


export function PreferencesSection() {
  return (
    <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-ink">
        Preferences
      </h2>

      <form className="mt-5 p-4">
        <PreferenceCard />
      </form>
    </section>
  );
}