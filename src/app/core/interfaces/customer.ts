export interface Customer {
  identifier: number;
  first_name: string;
  last_name: string;
  fullName?: string; // campo auxiliar calculado
}
