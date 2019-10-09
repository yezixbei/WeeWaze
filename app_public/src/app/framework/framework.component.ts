import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-framework',
  templateUrl: './framework.component.html',
  styleUrls: ['./framework.component.css']
})

/*
The framework holds the navigation bar and the footer in place, and
it is the entry point of the angular part of the app from index.html.
*/
export class FrameworkComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
