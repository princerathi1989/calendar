import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(
    private router: Router
  ) { }

  cleanSubscriptions(subscriptions: Subscription[]): void {
    subscriptions.forEach((subscription: Subscription) => subscription && subscription.unsubscribe());
  }

  showLoader(message: string): void {
    message = '<div>' + message + '</div><div>Please wait.</div>';
    Swal.fire({
      title: 'processing',
      icon: 'info',
      showClass: { popup: '', icon: '' },
      hideClass: { popup: '' },
      grow: 'fullscreen',
      showConfirmButton: false,
      html: message,
      allowOutsideClick: false
    });
  }

  hideLoader(): void {
    Swal.close();
  }

  showSuccess(message: string, path?: string): void {
    Swal.fire({
      title: 'thank you.',
      icon: 'success',
      html: message,
      allowOutsideClick: false,
      confirmButtonText: 'Exit',
      confirmButtonAriaLabel: 'Exit'
    }).then(() => {
      if (path) { this.router.navigate([path]); }
    });
  }

  showError(message: string, btnText = 'Try again'): void {
    Swal.fire({
      title: 'alert!',
      icon: 'error',
      html: message,
      timer: environment.errorTimeout * 1000,
      allowOutsideClick: false,
      confirmButtonText: btnText,
      confirmButtonAriaLabel: btnText
    }).then(() => {
      // if (path) { this.navigate(path); }
    });
  }

  showConfirm(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your event has been deleted.',
          'success'
        );
      }
    });
  }

  setWithExpiry(key: string, value: number, ttl: number): void {
    const now = new Date();
    const item = {
      value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  getWithExpiry(key: string): number | null {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }
}
