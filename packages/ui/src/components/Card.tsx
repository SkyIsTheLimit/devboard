import { FC, ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export const Card: FC<CardProps> = ({
  children,
  className = "",
  padding = true,
}) => (
  <div
    className={`
      bg-primary-muted-2500 text-primary-muted-500 rounded-lg shadow-sm
      ${padding ? "p-6" : ""}
      ${className}
    `}
  >
    {children}
  </div>
);
