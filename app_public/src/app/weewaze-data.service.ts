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

  private parseDayOfWeek(day: string): number {
    const whatday = {
      "sunday": 1,
      "monday": 2,
      "tuesday": 3,
      "wednesday": 4,
      "thursday": 5,
      "friday": 6,
      "saturday": 7
    }
    return whatday[day.toLowerCase()];
  }

  private checkQuery(day: string, min: string, max: string, dir: number, tb: number): boolean {
    var p_day: number;
    var p_min: number;
    var p_max: number

    try {
      p_day = this.parseDayOfWeek(day);
      p_min = Math.floor(parseInt(min));
      p_max = Math.floor(parseInt(max));
    } catch (e) {
      alert(e);
    }

    if (p_day < 1 || 7 < p_day || 
      p_min < 0 || 23 < p_max || p_min > p_max || 
      !(dir == 0 || dir == 1) ||
      !(tb == 0 || tb == 1)) return false;

    return true;
  }

  private callHTTP(day: string, min: string, max: string, dir: string, tb: string): Promise<Points[]> {
    const url: string = `${this.apiBaseUrl}/points?day=${day}&min=${min}&max=${max}&dir=${dir}&tb=${tb}`;
    return this.http.get<Points[]>(url)
      .toPromise()
      .then(
        response => {
          console.log(response[1]);
          return response[0];
        })
      .catch(this.handleError);
  }

  public talkToBackEnd(day: string, min: string, max: string, reverse: number, tb: number): Promise<Points[]>{
    if (this.checkQuery(day, min, max, reverse, tb)) 
      return this.callHTTP(this.parseDayOfWeek(day).toString(), min, max, reverse.toString(), tb.toString());
  }
}
