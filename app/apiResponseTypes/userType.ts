import { Preferences } from "./preferencesType";
import { Profile } from "./profileType";
import { ChildProfilePaginator } from "./childProfilePaginatorType";
import { UUID, DateString } from "./sharedTypes";
import { ChildrenData } from "./childrenDataType";

export interface User {
  id: UUID;
  username: string;
  email: string;
  created_at: DateString;
  updated_at: DateString;
  preferences: Preferences | null;
  profile: Profile;
  children: ChildrenData
}