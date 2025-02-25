import { ChildProfile } from "./childProfileType";

export interface ChildProfilePaginator {
  data: ChildProfile[];
  current_page: number;
  per_page: number;
  total: number;
}