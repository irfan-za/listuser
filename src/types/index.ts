export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  birthdate: string;
  address: {
    street: string;
    city: string;
    province: string;
    postal_code: string;
  } | null;
}

export interface IPaginationInfo {
  page: number;
  totalPages: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IUsersResponse {
  users: IUser[];
  pagination: IPaginationInfo;
}
