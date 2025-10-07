import { Component, AfterViewInit } from '@angular/core';
import { EventService } from '../services/event.service';


declare var $: any;
@Component({
  selector: 'app-event-calendar-page',
  templateUrl: './event-calendar-page.component.html',
  styleUrls: ['./event-calendar-page.component.css']
})
export class EventCalendarPageComponent implements AfterViewInit {

  eventList: any[] = [];
 
  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.fetchEvents();
  }
  
  ngAfterViewInit() {
    // Inisialisasi kalender setelah view selesai dimuat
    $('#calendar').evoCalendar({
      theme: 'Royal Navy',
      eventHeaderFormat: 'MM dd, yyyy',
      eventListToggler: true,
      sidebarToggler: true,
      calendarEvents: [],
    });
  }

  fetchEvents(): void {
    this.eventService.fetchEvents().subscribe(
      (events) => {
        events.forEach((event) => {
          const eventId = event._id; // MongoDB _id
          const startDate = event.startDate;
          const endDate = event.endDate || startDate;
          const color = event.color || this.getRandomColor();
  
          // Create event object for eventList
          const eventObj = {
            id: eventId,
            name: event.name,
            startDate: startDate,
            endDate: endDate,
            note: event.note,
            color: color
          };
  
          // Add to local event list
          this.eventList.push(eventObj);
  
          // Create event object for EvoCalendar
          const calendarEventObj = {
            id: eventId,
            name: event.name,
            date: [startDate, endDate],
            description: event.note,
            type: "event",
            color: color
          };
  
          // Simulate adding event dynamically to EvoCalendar
          setTimeout(() => {
            $('#calendar').evoCalendar('addCalendarEvent', calendarEventObj);
          }, 100);
        });
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  getRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }
}
