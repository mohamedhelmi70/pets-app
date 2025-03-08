import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppParamList {}
  }
}

export type AppScreenProps<Screen extends keyof AppParamList> =
  NativeStackScreenProps<AppParamList, Screen>;

export type AppParamList = {
  PetsList: undefined;
  SingleProfile: { id: string };
  AddNewVetVisit: { id: string };
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string | null;
  age: number | string;
  created_at: any;
  owner_id: string;
  logs_weight: Array<WeightLog>;
  logs_bodycondition: Array<BodyConditionLog>;
  logs_vet_visits: VetVisitLog[] | null;
}

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  full_name?: string | null | undefined;
  avatar_url?: string;
  updated_at?: any;
}

export interface WeightLog {
  id: string;
  pet_id: string;
  weight: any;
  date: string;
}

export interface BodyConditionLog {
  date: string;
  id: string;
  body_condition: string | number;
  pet_id: string;
}

export type LogType = 'weight' | 'body' | 'vet' | any;

export interface VetVisitLog {
  id: string;
  pet_id: string;
  notes: string | null;
  date: string;
} 