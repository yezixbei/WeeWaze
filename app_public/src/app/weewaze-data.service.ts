import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Points } from './points';

@Injectable({
  providedIn: 'root'
})
export class WeewazeDataService{
  private apiBaseUrl = environment.apiBaseUrl; // under src/environment

  constructor(private http: HttpClient) { }
  private handleError(error: any): Promise<any> { return Promise.reject(error.message || error); }

  private parseDayOfWeek(day: string): string {
    const whatday = {
      "sunday": '1',
      "monday": '2',
      "tuesday": '3',
      "wednesday": '4',
      "thursday": '5',
      "friday": '6',
      "saturday": '7'
    }

    return whatday[day.toLowerCase()];
  }

  public checkQuery(day: string, min: string, max: string, dir: string): boolean {
    var p_day: number;
    var p_min: number;
    var p_max: number;
    var p_dir: number;

    p_day = parseInt(this.parseDayOfWeek(day));
    p_min = Math.floor(parseInt(min));
    p_max = Math.floor(parseInt(max));
    p_dir = parseInt(dir);

    if (isNaN(p_day) || isNaN(p_min) || isNaN(p_max) || isNaN(p_dir)) {return false;}

    if (p_day < 1 || 7 < p_day || p_min < 0 || 23 < p_max || p_min > p_max || 
      !(p_dir == 0 || p_dir == 1)) {return false;}

    return true;
  }

  public callHTTP(day: string, min: string, max: string, dir: string): Promise<Points[]> {
    const url: string = `${this.apiBaseUrl}/points?day=${this.parseDayOfWeek(day)}&min=${min}&max=${max}&dir=${dir}&tb=0`;
    return this.http.get<Points[]>(url)
      .toPromise()
      .then(
        response => {
          console.log(response[1]);
          return response[0];
        })
      .catch(this.handleError);
  }
}
