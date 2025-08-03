export function FancyCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
}) {
  return (
    <div
      className="flex items-center justify-between cursor-pointer"
      onClick={() => onChange(prev => !prev)}
    >
      <div className="relative">
        <div
          className={`bg-gradient-to-r from-yellow-300 via-amber-100 to-red-300 border border-red-800 rounded w-6 h-6 ${
            checked ? "" : "shadow-inner"
          }`}
        />

        {/* Checkmark */}
        {checked && (
          <svg
            className="absolute pointer-events-none w-4 h-4 text-red-800 "
            style={{ top: "5px", left: "5px" }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={6} // Increased stroke width for a bolder tick
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <div className="text-lg font-bold text-gray-800">{label}</div>
    </div>
  );
}
