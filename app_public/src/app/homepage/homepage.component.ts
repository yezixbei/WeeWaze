import { Component, ViewChild, AfterViewInit} from '@angular/core';
import { WeewazeDataService } from '../weewaze-data.service';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { Points } from '../points';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  public pageContent = {
    header: {
      title: 'WeeWaze',
      strapline: 'Get City-Wide Traffic Patterns for San Francisco!'
    }
  };

  public mapData: Points[];

  @ViewChild(SideBarComponent, { static: false })
  sidebar: SideBarComponent;


  constructor(private weewazeDataService: WeewazeDataService){ }

  ngAfterViewInit(){
    this.getMapData();
  }

  public getMapData():void {
    this.weewazeDataService.callHTTP(this.sidebar.query.day, this.sidebar.query.min, this.sidebar.query.max, this.sidebar.query.dir)
      .then(data => { 
        this.mapData = data; 
      })
      .catch(error => {
        console.log(error);
      });
  }

}