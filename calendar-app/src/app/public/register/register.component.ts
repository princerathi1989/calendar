import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PasswordValidation } from '../../core/validators/password.validator';
import { FacadeService } from '../../core/services/facade.service';
import { SharedService } from '../../core/services/shared.service';
import { User } from './../../models/user';
import { patterns } from '../../core/const/constants';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  subs: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private facadeService: FacadeService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  /** Creating the Form */
  createForm(): void {
    this.form = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(patterns.name)]
      ],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(patterns.name)]
      ],
      email: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200),
        Validators.pattern(patterns.email)
      ]],
      phone: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200),
        Validators.pattern(patterns.phone)
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(/(?=.*?[0-9])/g),
        Validators.minLength(6)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    }, {
      validator: [PasswordValidation.MatchPassword]
    });
  }

  register(): void {
    this.sharedService.showLoader('Creating you account.');
    const userData = this.getFormattedData(this.form.value);
    this.form.reset();
    this.subs.push(this.facadeService.addUser(userData).subscribe(
      (data) => {
        this.sharedService.hideLoader();
        if (data.success) {
          this.sharedService.showSuccess('Account successfully created.', '/public/login');
        } else {
          this.sharedService.showError('Creating you account.');
        }
      }, (err) => {
        this.sharedService.showError(err.statusText);
      }
    ));
  }

  getFormattedData(data: any): User {
    return {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password
    };
  }
}
