import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/service/shared.service';


@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  defaultImage = "assets/images/noimage.svg";

  title: string;
  isCategoriesView: boolean;
  backgroundImage: string;

  constructor(
    private location: Location,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.sharedService.currentViewData.subscribe(data => {
      this.title = data.title;
      this.isCategoriesView = data.isCategoriesView;
    });

    this.sharedService.currentbackgroundImageSource.subscribe(source =>
      this.backgroundImage = source
    );
  }

  navigateBack() {
    this.sharedService.changeBackgroundImage(this.defaultImage);
    this.location.back();
  }

}
