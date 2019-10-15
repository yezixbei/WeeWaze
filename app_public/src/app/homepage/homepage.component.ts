import { Component, ViewChild, AfterViewInit} from '@angular/core';
import { WeewazeDataService } from '../weewaze-data.service';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { Point } from '../point';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})

/*
The homepage consists of a page header, a scatter plot, and a sidebar.
It receives user queries from the side bar, communicates with the backend, and 
sends the results to the scatter plot.
*/
export class HomepageComponent {
  @ViewChild(SideBarComponent, { static: false })
  sidebar: SideBarComponent;

  public pageContent = {
    header: {
      title: 'WeeWaze',
      strapline: 'Get City-Wide Traffic Patterns for San Francisco!'
    }
  };
  public mapData: Point[];


  constructor(private weewazeDataService: WeewazeDataService){ }

  // get data for the default map after sidebar initializes
  ngAfterViewInit(){
    this.getMapData();
  }

  public getMapData():void {
    this.weewazeDataService.callHTTP(this.sidebar.query.day, this.sidebar.query.min, this.sidebar.query.max)
      .then(data => { 
        this.mapData = data; 
      })
      .catch(error => {
        console.log(error);
      });
  }

}