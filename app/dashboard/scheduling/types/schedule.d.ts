interface EmployeeSchedule {
  id: string;
  orgId: string;
  employee_id: string;
  employee_name: string;
  position: string;
  date: Date;
  shift: string;
  location: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateScheduleDto {
  orgId: string;
  employee_id: string;
  employee_name: string;
  position: string;
  date: date;
  shift: string;
  location: string;
}

interface UpdateScheduleDto extends Partial<CreateScheduleDto> {
  id: string;
}
