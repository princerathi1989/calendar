import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { User } from './../../models/user';

@Injectable({
  providedIn: 'root'
})
export class FacadeService {
  private user: UserService;
  public get userService(): UserService {
    if (!this.user) {
      this.user = this.injector.get(UserService);
    }
    return this.user;
  }

  constructor(private injector: Injector) { }

  getAppointments(id: number): Observable<any> {
    return this.userService.getAppointments(id);
  }

  saveAppointment(data: any): Observable<any> {
    return this.userService.saveAppointment(data);
  }

  addUser(data: User): Observable<any> {
    return this.userService.add(data);
  }

  verifyUser(email: string, password: string): Observable<any> {
    return this.userService.verify(email, password);
  }
}
