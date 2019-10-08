import { Component, ElementRef, OnInit, OnChanges, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import * as d3 from 'd3';
import { Points } from '../points';


@Component({
  selector: 'app-scatter-plot',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.css']
})
export class ScatterPlotComponent implements OnChanges {
  @ViewChild('plot', { static: false })
  private plotContainer: ElementRef;

  @Input()data: Points[];

  FILEPATH: string = '../assets/data/twogb.csv';
  MAX_X:number = 925;
  MAX_Y:number = 625;

  constructor() { }

  ngOnInit(): void {
    this.createPlot();
  }

  ngOnChanges(): void {
    this.createPlot();
  }

  onResize() {
    this.createPlot();
  }

  private createPlot(): void {
    if (!this.data) return;

    d3.select('svg').remove();

    const element = this.plotContainer.nativeElement;
    var margin = { top: 10, right: 30, bottom: 30, left: 60 };
    var width = element.clientWidth - margin.left - margin.right;
    var height = 0.95 * width - margin.top - margin.bottom;


    // Append SVG to the view
    var svg = d3.select(element)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add Hidden X axis
    var x = d3.scaleLinear()
      .domain([0, 0])
      .range([0, width]);
    svg.append("g")
      .attr("class", "first_x_axis")   // call this later via svg.select(".first_x_axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)) // add linear scale to the bottom axis
      .attr("opacity", "1") // hidden by default

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, this.MAX_Y])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));


    // Add Color
    var color = d3.scaleOrdinal<string, string>() // added <str, str>
      .domain(["1", "2", "3", "4", "5"])
      .range(["#F8766D", "#F9DC5C", "#00BA38", "#619CFF", "#619CFF"])


    // Add Tooltip
    var tooltip = d3.select(element)
      .append("div")
      .style("opacity", 0) // hidden by default
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")

    // Add Tooltip Functions
    var mouseover = function (d) {
      tooltip
        .style("opacity", 1) // now we can see it
    }
    var mousemove = function (d) {
      tooltip
        .html("The exact speed at <br> (" + d.longitude + ", " + d.latitude + ") <br> is " + d.speed + " mph")
        .style("left", (d3.mouse(this)[0] + 90) + "px") // +90 from the original point
        .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function (d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0) // now we don't
    }

    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(this.data)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(d["x"]); })
      .attr("cy", function (d) { return y(d["y"]); })
      .attr("r", 2)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      // in the color function we had to add <str, str> to make the next line compile
      .style("fill", function (d) { return color(d["bucket"]) });


    // Add new X axis
    x.domain([0, this.MAX_X])
    svg.select(".orignial_x_axis")
      .transition()
      .duration(2000)
      .attr("opacity", "1")
    //.call(d3.axisBottom(x));

    // Add animation to circles
    svg.selectAll("circle")
      .transition()
      .delay(function (d, i) { return (i * 2) })
      .duration(2000)
      .attr("cx", function (d) { return x(d["x"]); })
      .attr("cy", function (d) { return y(d["y"]); })
    };
}
  


  