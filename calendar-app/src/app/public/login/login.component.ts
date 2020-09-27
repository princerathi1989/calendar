import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FacadeService } from '../../core/services/facade.service';
import { SharedService } from '../../core/services/shared.service';
import { StreamService } from 'src/app/core/services/stream.service';
import { patterns } from '../../core/const/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  subs: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private facadeService: FacadeService,
    private sharedService: SharedService,
    private streamService: StreamService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  /** Creating the Form */
  createForm(): void {
    this.form = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200),
        Validators.pattern(patterns.email)
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(/(?=.*?[0-9])/g),
        Validators.minLength(6)
      ]]
    });
  }

  login(): void {
    this.sharedService.showLoader('verifying your credentials.');
    this.subs.push(this.facadeService.verifyUser(this.form.value.email, this.form.value.password)
      .subscribe((data) => {
        if (data.success) {
          this.subs.push(this.streamService.userData.obs
            .subscribe((res: any) => {
              if (res === null || res === undefined) {
                this.streamService.getAppointments(data.id);
              } else {
                this.sharedService.hideLoader();
                if (res.success) {
                  this.sharedService.setWithExpiry('id', data.id, 1000000);
                  this.router.navigate(['/account/calendar']);
                } else {
                  this.sharedService.showError(res.message);
                }
              }
            }, () => {
              this.sharedService.hideLoader();
              this.sharedService.showError('Something went wrong!');
            })
          );
        } else {
          this.sharedService.showError(data.message);
        }
      }, (err) => {
        this.form.reset();
        this.sharedService.showError(err.statusText);
      }
    ));
  }

  ngOnDestroy(): void {
    this.sharedService.cleanSubscriptions(this.subs);
  }
}
