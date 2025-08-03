export function FancyHeading({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const colors = [
    "text-red-500",
    "text-blue-500",
    "text-yellow-500",
    "text-green-500",
    // "text-purple-500",
    // "text-pink-500",
    // "text-orange-500",
    // "text-teal-500",
  ];

  return (
    <div className={className}>
      {text.split("").map((char, index) => (
        <span key={index} className={colors[index % colors.length]}>
          {char}
        </span>
      ))}
    </div>
  );
}
