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
      console.log("low", data);
      this.topExpensive = data;
      this.topExpensive.sort((a:Prices, b:Prices) => b.price - a.price);
      this.topExpensive = this.topExpensive.slice(0,10);
      this.createSvg();
      this.drawBars(this.topExpensive);
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

  private drawBars(data: Prices[]): void {
    console.log(data)
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
      .domain([0, this.topExpensive[0].price])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
      .call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg.selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d: Prices) => x(d.location))
      .attr("y", (d: Prices) => y(d.price))
      .attr("width", x.bandwidth())
      .attr("height", (d: Prices) => this.height - y(d.price))
      .attr("fill", "#d04a35");
  }
}
