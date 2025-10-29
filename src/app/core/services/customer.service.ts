import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Customer } from '../interfaces/customer';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private apiUrl = `${environment.urlBackEnd}/v1/api/customer`;

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl).pipe(
      map(customers =>
        customers.map(c => ({
          ...c,
          fullName: `${c.first_name} ${c.last_name}`
        }))
      )
    );
  }

  createCustomer(customer: Partial<Customer>): Observable<Customer> {
  return this.http.post<Customer>(this.apiUrl + '/save', customer);
}
}
