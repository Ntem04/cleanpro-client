interface ServicesLeafProps {
  className?: string;
  color?: string;
}

export default function ServicesLeaf({
  className = "",
  color = "#5bbd88",
}: ServicesLeafProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 85C14 42 42 12 88 10C89 56 61 86 12 85Z"
        fill={color}
      />
    </svg>
  );
}
