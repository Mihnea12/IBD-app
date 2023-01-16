import { Component } from '@angular/core';
import {AppService} from "../../service/app.service";
import * as d3 from "d3";
import {Prices} from "../../model/Prices";

@Component({
  selector: 'app-top-low-priced',
  templateUrl: './top-low-priced.component.html',
  styleUrls: ['./top-low-priced.component.css']
})
export class TopLowPricedComponent {
  topExpensive: Prices[] = [];
  private svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  constructor(private appService: AppService) {

  }

  ngOnInit(): void {
    this.appService.getPrices().subscribe(data => {
      this.topExpensive = data;
      this.topExpensive.sort((a:Prices, b:Prices) => a.spending - b.spending);
      this.topExpensive = this.topExpensive.slice(0,10);
      this.createSvg();
      this.drawBars(this.topExpensive);
    });

  }

  getTopValue(){
    return this.topExpensive[this.topExpensive.length - 1].spending;
  }

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawBars(data: Prices[]): void {
    // Create the X-axis band scale
    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(data.map((d:Prices) => d.location))
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
      .domain([0, this.getTopValue()])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
      .call(d3.axisLeft(y));

    this.svg.append("text")
      .attr("x", (this.width / 2))
      .attr("y", 0 - (50 / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "none")
      .text("Top 10 Locations With The Lower Price");

    var margin = {top: 20, right: 20, bottom: 40, left: 60}


// Y axis label:
    this.svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -margin.top)
      .text("Price")

    // Create and fill the bars
    this.svg.selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d: Prices) => x(d.location))
      .attr("y", (d: Prices) => y(d.spending))
      .attr("width", x.bandwidth())
      .attr("height", (d: Prices) => this.height - y(d.spending))
      .attr("fill", "#2136b9");
  }
}
