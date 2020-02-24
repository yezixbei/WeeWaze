import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Point } from './point';

@Injectable({
  providedIn: 'root'
})

/*
Contains the logic for communicating with the back end and for checking user input.
*/
export class WeewazeDataService{
  private apiBaseUrl = environment.apiBaseUrl; // under src/environment

  constructor(private http: HttpClient) { }
  private handleError(error: any): Promise<any> { return Promise.reject(error.message || error); }

  // Checks that the day is between 0 to 6, the hours are from 0 to 23, and all inputs are numbers. 
  public checkQuery(day: string, min: string, max: string): boolean {
    var p_day = parseInt(day); 
    var p_min = Math.floor(parseInt(min));
    var p_max = Math.floor(parseInt(max));

    if (isNaN(p_day) || isNaN(p_min) || isNaN(p_max)) {return false;}

    if (p_day < 0 || p_day > 6 || p_min < 0 || p_min > 23 || p_max < 0 || p_max > 23|| p_min > p_max) {return false;}

    return true;
  }

  public callHTTP(day: string, hourmin: string, hourmax: string): Promise<Point[]> {
    const url: string = `${this.apiBaseUrl}/partmap?day=${parseInt(day)}&hourmin=${hourmin}&hourmax=${hourmax}`;
    return this.http.get<Point[]>(url)
      .toPromise()
      .then(
        response => {
          console.log(response[1]); // response[1] is a list of completed database commands
          return response[0];
        })
      .catch(this.handleError);
  }
}
