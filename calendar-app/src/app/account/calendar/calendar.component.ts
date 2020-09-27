import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { SharedService } from './../../core/services/shared.service';
import { StreamService } from '../../core/services/stream.service';
import { EventValues } from './../../models/event';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  /** to hold the subscriptions */
  subs: Subscription[] = [];
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  refresh: Subject<any> = new Subject();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: {
    id?: number;
    event: EventValues;
  };
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];
  events: CalendarEvent[] = [];
  activeDayIsOpen = true;

  constructor(
    private modal: NgbModal,
    private router: Router,
    private sharedService: SharedService,
    private streamService: StreamService
  ) { }

  ngOnInit(): void {
    this.subs.push(this.streamService.userData.obs
      .subscribe((res) => {
        if (res === null || res === undefined) {
          this.streamService.getAppointments(this.sharedService.getWithExpiry('id'));
        } else {
          const data = JSON.parse(res.data.appointments);
          data.forEach((item: EventValues) => {
            item.start = new Date(item.start);
            item.end = new Date(item.end);
          });
          this.events = data;
        }
      })
    );
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log(action);
    this.modalData = { event: new EventValues(event) };
    this.modal.open(this.modalContent);
  }

  addEvent(): void {
    this.modalData = { id: ++this.events.length, event: new EventValues() };
    this.modal.open(this.modalContent);
  }

  deleteEvent(eventToDelete: CalendarEvent): void {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
  }

  logout(): void {
    this.sharedService.cleanSubscriptions(this.subs);
    this.streamService.userData.clear();
    localStorage.removeItem('id');
    this.router.navigate(['/public/login']);
  }

  ngOnDestroy(): void {
    this.sharedService.cleanSubscriptions(this.subs);
  }

}
