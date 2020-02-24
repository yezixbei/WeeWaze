import { Component, Output, EventEmitter } from '@angular/core';
import { WeewazeDataService } from '../weewaze-data.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})

/*
The sidebar receives and checks user input and alerts the homepage that it is ready.

*/
export class SideBarComponent{
  public directions = "Enter a different hour range and day of the week to see a new map. "
  public strapline = "Each dot represent 100 square meters in the city. Hover over it to see the average speed at that location.";
  
  public formError: string = '';
  private curr: Date = new Date();
  public query = { // initialize with current day and time
    day: this.curr.getDay().toString(),
    min: this.curr.getHours().toString(),
    max: ((this.curr.getHours() + 4) > 23 ? '23' : (this.curr.getHours() + 4)).toString(), // default interval is 4 hrs
  };

  @Output() querySubmit = new EventEmitter<string>();

  
  constructor(public weewazeDataService: WeewazeDataService) { 
  }

  public onSubmit(): void {
    this.formError = '';
    if (!this.query.day || !this.query.min || !this.query.max) {
      this.formError = 'All fields are required. Please try again!';
    }else{
      if (this.weewazeDataService.checkQuery(this.query.day, this.query.min, this.query.max)) {
        this.querySubmit.emit('');
      } else {
        this.formError = 'Days must be intergers from 0 to 6 and hours must be integers from 0 to 23. Please try again!';
      }
    } 
  }
}
