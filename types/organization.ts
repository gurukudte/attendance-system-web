export interface Organization {
  id: string;
  name: string;
  timezone: string;
  dateFormat: string;
  customEmployeeFields: customEmployeeFields[];
  apiKeys: ApiKey[];
  adminUsers: AdminUser[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface customEmployeeFields {
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
  createdAt: Date;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  orgId: string;
}
