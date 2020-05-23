import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  @Input() title: string;
  @Input() backgroundImage: string;
  @Input() isCategoriesView: boolean;


  constructor(private location: Location) { }

  ngOnInit(): void {
  }

  navigateBack() {
    this.location.back();
  }

}
