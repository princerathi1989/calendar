import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { StreamService } from '../services/stream.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private sharedService: SharedService
  ) { }

  canActivate(): boolean {
    if (!this.sharedService.getWithExpiry('id')) {
      return false;
    }
    return true;
  }
}
