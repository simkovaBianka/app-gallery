import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../../service/data.service';
import { SharedService } from 'src/app/service/shared.service';

import { Item } from '../../shared/item';
import { Constants } from 'src/app/shared/constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.sass'],
  providers: [DataService]
})
export class ItemListComponent implements OnInit, OnDestroy {
  private viewDataSubscription: Subscription;
  private routeSubscription: Subscription;

  isCategoriesView: boolean;
  itemsList: Item[] = [];
  itemText: string;
  title: string;

  constructor(
    private dataService: DataService,
    private sharedService: SharedService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.viewDataSubscription = this.sharedService.currentViewData.subscribe(data => {
      this.title = data.title;
      this.isCategoriesView = data.isCategoriesView;
    })

    this.routeSubscription = this.route.params.subscribe(params => {
      let path: string = params['path'];
      path ? this.getImages(path) : this.getGalleries();
    });
  }

  /**
   * Update background(header) image.
   * @param imageSource - Image blob source
   */
  changeBackground(imageSource: string): void {
    this.sharedService.changeBackgroundImage(imageSource);
  }

  /**
   * Called when main (categories) view is opened.
   * Get all galleries from service and update view.
   */
  getGalleries(): void {
    this.itemText = Constants.CATEGORY_TEXT;
    this.sharedService.changeViewData({ "title": Constants.TITLE_TEXT, "isCategoriesView": true });

    this.dataService.getAllGalleriesData().subscribe((data) => {
      this.itemsList = data['galleries'];
    })
  }

  /**
   * Called when gallery view is opened.
   * Get all images of the gallery from service and update view.
   */
  getImages(path: string): void {
    this.dataService.getImages(path).subscribe((data) => {
      this.itemText = Constants.IMAGE_TEXT;
      this.sharedService.changeViewData({ "title": path, "isCategoriesView": false });
      this.itemsList = data['images'];
    });
  }

  /**
   * Add new gallery to categories list.
   * @param name - Name of new gallery
   */
  addGallery(name: string) {
    // remove '/' character from name 
    let regex = "/";
    let replacedName = name.replace(regex, "");

    if (replacedName) {
      this.dataService.addGallery(replacedName).subscribe((data) => {
        data.imageSource = Constants.DEFAULT_IMAGE // without thumbnail image
        this.itemsList.push(data); // update view
      });
    }
  }

  /**
   * Add new image to gallery.
   */
  addImage() {
    this.imagesToUpload.forEach(image => {
      let fullPath: string = `${this.title}/${image.name}`;

      this.dataService.addImage(fullPath, image).subscribe((data) => {
        // TODO
        console.log(data);
      });
    });
  }

  /**
   * Change background(header) image and show Gallery info 
   * (number of images in gallery) when onHover is triggered on item.
   * @param index - Index of item from itemsList
   */
  mouseEnter(index: number): void {
    // only in categories view
    if (this.isCategoriesView) {
      (this.itemsList[index]).hover = true;
      let thumbnailImage = (<Item>this.itemsList[index]).thumbnailImage;
      let fullSizeImage = (<Item>this.itemsList[index]).realSizeImage;
      this.changeBackground(fullSizeImage ? fullSizeImage : thumbnailImage);
    }
  }


  // modal upload files(images)
  imagesToUpload: File[] = [];

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files: any[]) {
    this.prepareFilesList(files);
  }

  /**
   * Convert Files list to normal array list
   * @param files - Files List
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      this.imagesToUpload.push(item);
    }
  }

  ngOnDestroy(): void {
    this.viewDataSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }
}
