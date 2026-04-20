export class MemberRosterDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'PAID' | 'UNPAID';
  nextDueDate: Date;
  lastPaymentDate: Date;
}
