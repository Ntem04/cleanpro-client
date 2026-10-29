interface LeafDecorationProps {
  className?: string;
  color?: string;
}

export default function LeafDecoration({
  className = "",
  color = "#dcefe5",
}: LeafDecorationProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 83C15 43 39 13 88 10C89 57 63 85 13 83Z"
        fill={color}
      />
      <path
        d="M16 82C36 62 57 41 84 15"
        stroke="#b8ddc8"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
