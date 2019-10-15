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
  private d: Date = new Date();
  public query = { // initialize with the current day and time
    day: this.d.getDay().toString(),
    min: this.d.getHours().toString(),
    max: ((this.d.getHours() + 4) > 23 ? 23 : (this.d.getHours() + 4)).toString(), 
  };

  @Output() querySubmit = new EventEmitter<string>();

  
  constructor(public weewazeDataService: WeewazeDataService) { 
  }

  public onSubmit(): void {
    this.formError = '';
    if (!this.query.day || !this.query.min || !this.query.max) {
      this.formError = 'All fields are required, please try again';
    } else if (this.weewazeDataService.checkQuery(this.query.day, this.query.min, this.query.max)){
      this.querySubmit.emit('');
    } else {
      this.formError = 'Please enter a day from 1 to 7 and an hour range from 0 to 23.';
    }
  }
}
