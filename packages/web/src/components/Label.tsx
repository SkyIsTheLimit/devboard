export interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
}

export function Label({ name, className = "", ...props }: LabelProps) {
  return (
    <span
      className={`
        ${className}
        inline-block
        text-sm
        px-2 py-1
        rounded-full
    `}
      {...props}
    >
      {name}
    </span>
  );
}
