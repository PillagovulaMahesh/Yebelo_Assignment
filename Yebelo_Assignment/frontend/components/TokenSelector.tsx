"use client";

interface TokenSelectorProps {
  tokens: string[];
  selected: string;
  onChange: (token: string) => void;
}

export default function TokenSelector({ tokens, selected, onChange }: TokenSelectorProps) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-md flex items-center gap-2">
      <label className="text-gray-700 font-medium">Select Token:</label>
      <select
        className="border rounded-lg px-3 py-2"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        {tokens.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}
