"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@devboard-interactive/ui";
import { LoaderCircle, Menu } from "lucide-react";

import { Container } from "./container";
import { SearchItem } from "./FilterStatus";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const FilterDropdownMenu = ({
  activeItem,
  searchList,
  onChange,
  loadingItem,
  isLoading,
  className,
}: {
  activeItem: SearchItem;
  searchList: SearchItem[];
  onChange?: (item: SearchItem) => void;
  loadingItem?: SearchItem;
  isLoading?: boolean;
  className?: string;
}) => {
  const handleClick = (item: SearchItem) => {
    onChange?.(item);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Open menu"
          size="sm"
          className={cn("w-full justify-start", className)}
        >
          <Menu /> {isLoading ? loadingItem?.label : activeItem.label}
          {isLoading && <LoaderCircle className="animate-spin" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Choose Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {searchList.map((item) => (
          <DropdownMenuCheckboxItem
            key={`${item.label}-${item.status}`}
            checked={item.status === activeItem.status}
            onClick={() => handleClick(item)}
          >
            {item.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function Filter({
  activeItem,
  searchList,
}: {
  activeItem: SearchItem;
  searchList: SearchItem[];
}) {
  const [isLoading, setLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState<SearchItem | undefined>(
    undefined
  );
  const router = useRouter();

  if (isLoading && activeItem.status === loadingItem?.status) {
    setLoading(false);
  }

  const handleClick = ({ label, status, search }: SearchItem) => {
    if (status === activeItem.status) return;

    setLoading(true);
    setLoadingItem({ label, status, search });
    router.push(`/?status=${search || "all"}`);
  };

  return (
    <div className="border-b py-2 sticky z-10">
      <Container>
        <FilterDropdownMenu
          className="sm:hidden"
          activeItem={activeItem}
          searchList={searchList}
          onChange={handleClick}
          isLoading={isLoading}
          loadingItem={loadingItem}
        />
        <div className="sm:flex items-center gap-2 hidden">
          {searchList.map(({ label, status, search }) => (
            <Button
              key={`${label}-${status}`}
              onClick={() => handleClick({ label, status, search })}
              color="primary"
              variant={status === activeItem.status ? "outline" : "link"}
              className={cn(
                "flex flex-wrap gap-0",
                "rounded capitalize font-normal px-2 py-0",
                status === activeItem.status && "font-bold"
              )}
              disabled={status === activeItem.status}
            >
              {label}
              {isLoading && loadingItem?.status === status && (
                <LoaderCircle className="ml-2 animate-spin" />
              )}
            </Button>
          ))}
        </div>
      </Container>
    </div>
  );
}
