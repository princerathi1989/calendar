import { Injectable } from '@angular/core';
import { Resource } from './../../models/stream-resource';
import { FacadeService } from './facade.service';

@Injectable({
  providedIn: 'root'
})
export class StreamService {
  public userData = new Resource();

  constructor(private facadeService: FacadeService) { }

  getAppointments(id: number): void {
    this.userData.request(() => this.facadeService.getAppointments(id));
  }
}
