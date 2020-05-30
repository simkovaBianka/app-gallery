import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../../service/data.service';
import { Image, Gallery } from '../../model';
import { SharedService } from 'src/app/service/shared.service';

export abstract class Constants {
  static readonly CATEGORY_TEXT: string = "Pridať kategóriu";
  static readonly IMAGE_TEXT: string = "Pridať fotky";
  static readonly TITLE_TEXT: string = "Kategórie";
}

@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.sass'],
  providers: [DataService]
})
export class ItemListComponent implements OnInit {
  itemsList: (Image | Gallery)[] = [];
  itemText: string;

  // view data
  isCategoriesView: boolean;
  title: string;

  constructor(
    private dataService: DataService,
    private sharedService: SharedService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.sharedService.currentViewData.subscribe(data => {
      this.title = data.title;
      this.isCategoriesView = data.isCategoriesView;
    })

    this.route.params.subscribe(params => {
      let path: string = params['path'];
      path ? this.getImages(path) : this.getGalleries();
    });
  }

  changeBackground(imageSource: string): void {
    this.sharedService.changeBackgroundImage(imageSource);
  }

  getGalleries(): void {
    this.sharedService.changeViewData({ "title": Constants.TITLE_TEXT, "isCategoriesView": true });
    this.itemText = Constants.CATEGORY_TEXT;

    this.dataService.getAllGalleriesData().subscribe((data) => {
      this.itemsList = <Gallery[]>data['galleries'];
    })
  }

  getImages(path: string): void {
    this.sharedService.changeViewData({ "title": path, "isCategoriesView": false });
    this.itemText = Constants.IMAGE_TEXT;

    this.dataService.getImages(path).subscribe((data) => {
      this.itemsList = <Image[]>data['images'];
    });
  }


  addGallery(name: string) {
    let regex = "/";
    let replacedName = name.replace(regex, "");

    this.dataService.addGallery(replacedName).subscribe((data) => {
      data.imageSource = 'assets/images/noimage.svg'; // without thumbnail image
      this.itemsList.push(data);
    });
  }

  addImage() {
    this.imagesToUpload.forEach(image => {
      let fullPath: string = `${this.title}/${image.name}`;

      this.dataService.addImage(fullPath, image).subscribe((data) => {
        console.log(data);
      });
    });
  }

  onMouseEnter(index: number): void {
    if (this.isCategoriesView) {
      (<Gallery>this.itemsList[index]).hover = true;
      let thumbnailImage = (<Gallery>this.itemsList[index]).thumbnailImage;
      let fullSizeImage = (<Gallery>this.itemsList[index]).realSizeImage;
      this.changeBackground(fullSizeImage ? fullSizeImage : thumbnailImage);
    }
  }


  // modal upload files
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
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      this.imagesToUpload.push(item);
    }
  }
}
