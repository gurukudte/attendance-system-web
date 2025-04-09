export interface CustomEmployeeField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  orgId: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  orgId: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  orgId: string;
}

export interface OrganizationState {
  organization: {
    id: string;
    name: string;
    timezone: string;
    dateFormat: string;
    customEmployeeFields: CustomEmployeeField[];
    apiKeys: ApiKey[];
    adminUsers: AdminUser[];
  };
  loading: boolean;
  error: string | null;
}
