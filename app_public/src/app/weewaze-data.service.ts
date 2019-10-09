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

  // Checks all inputs are numbers and the day is between 1 to 7 and the hours are from 0 to 23.
  public checkQuery(day: string, min: string, max: string, dir: string): boolean {
    var p_day = parseInt(day)+1; // sunday is stored as "1" in the database
    var p_min = Math.floor(parseInt(min));
    var p_max = Math.floor(parseInt(max));
    var p_dir = parseInt(dir);

    if (isNaN(p_day) || isNaN(p_min) || isNaN(p_max) || isNaN(p_dir)) {return false;}

    if (p_day < 1 || 7 < p_day || p_min < 0 || 23 < p_max || p_min > p_max || 
      !(p_dir == 0 || p_dir == 1)) {return false;}

    return true;
  }

  public callHTTP(day: string, min: string, max: string, dir: string): Promise<Point[]> {
    const url: string = `${this.apiBaseUrl}/points?day=${parseInt(day) + 1}&min=${min}&max=${max}&dir=${dir}&tb=0`;
    return this.http.get<Point[]>(url)
      .toPromise()
      .then(
        response => {
          console.log(response[1]); // second half of the response is a record of your database interactions
          return response[0];
        })
      .catch(this.handleError);
  }
}
