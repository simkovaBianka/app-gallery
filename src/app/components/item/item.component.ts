import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from 'src/app/service/data.service';
import { SharedService } from 'src/app/service/shared.service';

import { Item } from '../../shared/item';
import { Constants } from 'src/app/shared/constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.sass'],
  providers: [DataService]
})

export class ItemComponent implements OnInit, OnDestroy {
  private viewDataSubscription: Subscription;

  @Input() index: number;
  @Input() itemsList: Item[];

  defaultImage = Constants.DEFAULT_IMAGE;
  isCategoriesView: boolean;

  constructor(
    private router: Router,
    private dataService: DataService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.viewDataSubscription =
      this.sharedService.currentViewData.subscribe(data => this.isCategoriesView = data.isCategoriesView);

    const path: string = this.isCategoriesView ? (this.itemsList[this.index].image?.fullpath || '')
      : (this.itemsList[this.index]).fullpath;

    if (path) { this.getImageObject(this.index, path); }
  }

  /**
   * Get image blob source.
   * First get small size image thumbnail, then 'realsize' image.
   * 'Realsize' image is used as background image (onHover) and
   * in image carousel.
   * @param index - Index of item in itemsList
   * @param imagePath - Image fullpath
   */
  getImageObject(index: number, imagePath: string) {
    this.dataService.getImage(imagePath, 270, 222).subscribe((blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        this.itemsList[index].thumbnailImage = reader.result as string;
      };
    });

    this.dataService.getImage(imagePath, 0, 600).subscribe((blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        this.itemsList[index].realSizeImage = reader.result as string;

        if (index === 0) {
          this.sharedService.changeBackgroundImage(reader.result as string);
        }
      };
    });
  }

  /**
   * Toggle image carousel modal.
   */
  openImageCarousel() {
    (document.getElementById('openModalButton') as HTMLElement).click();
  }

  /**
   * Navigate to gallery when onClick occured on item.
   * @param path - Image path (name)
   */
  navigate(path: string) {
    if (this.isCategoriesView) {
      const fullPath = `/gallery/${path}`;
      this.router.navigateByUrl(fullPath).then(response => {
        if (response) {
          console.log('Navigation is successful!');
        } else {
          console.log('Navigation has failed!');
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.viewDataSubscription.unsubscribe();
  }
}
