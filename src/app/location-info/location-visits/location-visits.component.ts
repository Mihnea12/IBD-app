import {Component, Input, OnInit} from '@angular/core';
import {AppService} from "../../service/app.service";
import * as d3 from 'd3';

@Component({
  selector: 'app-location-visits',
  templateUrl: './location-visits.component.html',
  styleUrls: ['./location-visits.component.css']
})
export class LocationVisitsComponent implements OnInit {
  @Input()
  locationId: string = "0";

  timestamps: Date[] = [];

  monthMap: MonthValue[] = [];

  private svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  max: number = 0;

  months = ["January", "February", "March",
    "April", "May", "June", "July", "August",
    "September", "October", "November", "December"];

  constructor(private appService: AppService) {
    for (let i = 0; i < 12; i++) {
      this.monthMap.push(new MonthValue(this.months[i], 0));
    }

  }

  ngOnInit(): void {
    this.appService.getVisitsForLocation(this.locationId).subscribe(data => {
      this.timestamps = data;
      this.timestamps.map(timestamp => new Date(timestamp).getMonth()).forEach((month: number) => {
        this.monthMap[month].value++;
      });
      this.monthMap.forEach(month => {
        if (this.max < month.value) {
          this.max = month.value;
        }
      })
      this.createSvg();
      this.drawBars(this.monthMap);
    })
  }

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawBars(data: MonthValue[]): void {
    // Create the X-axis band scale
    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(data.map((d: MonthValue) => d.month))
      .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
      .domain([0, this.max])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
      .call(d3.axisLeft(y));

    var margin = {top: 20, right: 20, bottom: 40, left: 60}

    this.svg.append("text")
      .attr("x", (this.width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "none")
      .text("Top 10 Most Visited Locations");


// Y axis label:
    this.svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -margin.top)
      .text("Number of visits")

    // Create and fill the bars
    this.svg.selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d: MonthValue) => x(d.month))
      .attr("y", (d: MonthValue) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d: MonthValue) => this.height - y(d.value))
      .attr("fill", "#19d333")
      .attr("title", "Top Visited");

  }

}

export class MonthValue {
  month: string;
  value: number;

  constructor(month: string, value: number) {
    this.month = month;
    this.value = value;
  }
}
