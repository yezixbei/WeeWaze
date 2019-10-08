import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  public directions = "Enter a different day and time range to see a new map. Reverse the direction of the traffic."
  public strapline = "Each dot represent 100 square meters in the city. Hover over it to see the average speed at that location.";
  
  public formError: string = '';
  public query = {
    day: 'Monday',
    min: '7',
    max: '9', 
    dir: 0
  };

  @Output() querySubmit = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  public onSubmit(): void {
    this.formError = '';
    if (!this.query.day || !this.query.min || !this.query.max) {
      this.formError = 'All fields are required, please try again';
    } else {
      this.querySubmit.emit('');
    }
  }
}
