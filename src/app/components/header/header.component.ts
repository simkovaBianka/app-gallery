import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/service/shared.service';
import { Constants } from 'src/app/shared/constants';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})

export class HeaderComponent implements OnInit {

  backgroundImage: string;
  defaultImage = Constants.DEFAULT_IMAGE;
  isCategoriesView: boolean;
  title: string;

  constructor(
    private location: Location,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.sharedService.currentViewData.subscribe(data => {
      this.title = data.title;
      this.isCategoriesView = data.isCategoriesView;
    });

    /**
     * Update background(header) image when onHover on item is triggered.
     */
    this.sharedService.currentbackgroundImageSource.subscribe(source =>
      this.backgroundImage = source
    );
  }

  /**
   * Navigate back to main(categories) view from gallery.
   */
  navigateBack() {
    this.sharedService.changeBackgroundImage(this.defaultImage);
    this.location.back();
  }

}
