import { Status } from "@/types";

export type SearchItemString =
  | "todo"
  | "in_progress"
  | "in_review"
  | "done"
  | "all";

export const isValidSearchItemString = (
  value?: string
): value is SearchItemString => {
  if (!value) return false;
  return ["todo", "in_progress", "in_review", "done", "all"].includes(value);
};

export type SearchItem = {
  status?: Status;
  label: string;
  search: SearchItemString;
};

export const searchDictionary: Record<SearchItemString, SearchItem> = {
  all: { status: undefined, label: "All", search: "all" },
  todo: { status: "TODO", label: "Todo", search: "todo" },
  in_progress: {
    status: "IN_PROGRESS",
    label: "In Progress",
    search: "in_progress",
  },
  in_review: { status: "IN_REVIEW", label: "In Review", search: "in_review" },
  done: { status: "DONE", label: "Done", search: "done" },
};

export const searchList: SearchItem[] = Object.values(searchDictionary);

export const parseSearchForStatus = (search?: string): SearchItem =>
  searchDictionary[isValidSearchItemString(search) ? search : "all"];
