import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.urlBackEnd}/v1/api/users`;

  // 🔹 Obtener todos los usuarios
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // 🔹 Buscar usuario por ID
  findById(identifier: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${identifier}`);
  }

  // 🔹 Buscar usuarios por estado (A o I)
  findByState(state: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/state/${state}`);
  }

  // 🔹 Registrar nuevo usuario
  save(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/save`, user);
  }

  // 🔹 Actualizar usuario existente
  update(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update`, user);
  }

  // 🔹 Desactivar usuario (cambio de estado a I)
  deactivate(identifier: number): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/deactivate/${identifier}`, {});
  }

  // 🔹 Restaurar usuario (cambio de estado a A)
  restore(identifier: number): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/restore/${identifier}`, {});
  }

  // 🔹 Buscar usuario por nombre
  findByName(name: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/name/${name}`);
  }
}
