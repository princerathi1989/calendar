import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FacadeService } from '../../core/services/facade.service';
import { SharedService } from './../../core/services/shared.service';
import { StreamService } from 'src/app/core/services/stream.service';
import { IEventValues } from '../../models/event';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit, OnDestroy {
  @Input() eventData: any;
  @Output() saveEvent = new EventEmitter<boolean>();
  editForm: FormGroup;
  subs: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private facadeService: FacadeService,
    private sharedService: SharedService,
    private streamService: StreamService
  ) { }

  ngOnInit(): void {
    this.createForm(this.eventData.event);
  }

  /** Creating the Form */
  createForm(data: IEventValues): void {
    this.editForm = this.fb.group({
      title: [data.title, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      primary: [data.color.primary],
      secondary: [data.color.secondary],
      start: [data.start],
      end: [data.end]
    });
  }

  submitEventDetails(): void {
    this.saveEvent.emit(true);
    this.sharedService.showLoader('Saving the event details');
    const payload = {
      id: JSON.parse(localStorage.getItem('id')).value,
      data: this.formattedData(this.editForm.value)
    };
    this.subs.push(this.facadeService.saveAppointment(payload)
      .subscribe(
        (data) => {
          this.sharedService.hideLoader();
          if (data.success) {
            this.sharedService.showSuccess('Event successfully saved');
            this.streamService.getAppointments(this.sharedService.getWithExpiry('id'));
          } else {
            this.sharedService.showError(data.message);
          }
        }, (err) => {
          this.sharedService.showError(err.statusText);
        }
    ));
  }

  formattedData(value: any): IEventValues {
    return {
      id: this.eventData.id ? this.eventData.id : this.eventData.event.id,
      title: value.title,
      color: {
        primary: value.primary,
        secondary: value.secondary
      },
      start: value.start,
      end: value.end
    };
  }

  ngOnDestroy(): void {
    this.sharedService.cleanSubscriptions(this.subs);
  }
}
