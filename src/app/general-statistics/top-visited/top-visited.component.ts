import {Component, OnInit} from '@angular/core';
import {Visits} from "../../model/Visits";
import {AppService} from "../../service/app.service";
import * as d3 from 'd3';

@Component({
  selector: 'app-top-visited',
  templateUrl: './top-visited.component.html',
  styleUrls: ['./top-visited.component.css']
})
export class TopVisitedComponent implements OnInit {
  topVisited: Visits[] = [];

  private svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  constructor(private appService: AppService) {
    this.topVisited.push(new Visits("",0));
  }

  ngOnInit(): void {
    this.appService.getVisits().subscribe(data => {
      this.topVisited = data;
      this.topVisited.sort((a: Visits, b: Visits) => b.visits - a.visits);
      this.topVisited = this.topVisited.slice(0, 10);
      this.createSvg();
      this.drawBars(this.topVisited);
    });

  }

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawBars(data: Visits[]): void {
    // Create the X-axis band scale
    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(data.map((d: Visits) => d.location))
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
      .domain([0, this.topVisited[0].visits])
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
      .attr("x", (d: Visits) => x(d.location))
      .attr("y", (d: Visits) => y(d.visits))
      .attr("width", x.bandwidth())
      .attr("height", (d: Visits) => this.height - y(d.visits))
      .attr("fill", "#19d333")
      .attr("title", "Top Visited");

  }
}
