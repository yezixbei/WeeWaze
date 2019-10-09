import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WeewazeDataService } from '../weewaze-data.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  public directions = "Enter a different day and time range to see a new map. "
  public strapline = "Each dot represent 100 square meters in the city. Hover over it to see the average speed at that location.";
  
  public formError: string = '';
  public query = {
    day: 'Monday',
    min: '7',
    max: '9', 
    dir: '0'
  };

  @Output() querySubmit = new EventEmitter<string>();

  constructor(public weewazeDataService: WeewazeDataService) { }

  ngOnInit() {
  }

  public onSubmit(): void {
    this.formError = '';
    if (!this.query.day || !this.query.min || !this.query.max) {
      this.formError = 'All fields are required, please try again';
    } else if (this.weewazeDataService.checkQuery(this.query.day, this.query.min, this.query.max, this.query.dir)){
      this.querySubmit.emit('');
    } else {
      this.formError = 'Oops, there is something wrong with your inputs!';
    }
  }
}
