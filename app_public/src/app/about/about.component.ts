import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})

export class AboutComponent implements OnInit {
  public pageContent = {
    header: {
      title: 'What is WeeWaze?',
      strapline: ''
    },
    content: `WeeWaze is a project to visualize historical traffic patterns using availble but underutilized data from public agencies. \n
    The traffic maps are generated using a subset of approximately 100 GB of GPS logs from the SFMTA, covering the routes of 330 buses in San Francisco over the span of four years from 2013 to 2016. The logs were transformed into batch views through an ETL pipeline built with Spark and served to the end user using this web portal and a separate REST API. This web portal is a full-stack single page application built with D3, Angular, Node, Express, and PostgreSQL. To learn more about this project, go to my <a href="https://github.com/yezixbei/WeeWaze">github<\a> repository.
    `};

  constructor() { }

  ngOnInit() {
  }

}