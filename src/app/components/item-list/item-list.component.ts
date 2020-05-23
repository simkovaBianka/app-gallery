import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../../service/data.service';
import { Image, Gallery } from '../../model';

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
  isCategoriesView: boolean = true;

  backgroundImage: string;
  itemText: string;
  title: string;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let path: string = params['path'];

      path ? this.getImages(path) : this.getGalleries();
    });
  }

  changeBackground(imageSource: string): void {
    this.backgroundImage = imageSource;
  }

  getGalleries(): void {
    this.isCategoriesView = true;

    this.dataService.getAllGalleriesData().subscribe((data) => {
      this.itemText = Constants.CATEGORY_TEXT;
      this.title = Constants.TITLE_TEXT;
      this.itemsList = <Gallery[]>data['galleries'];
    })
  }

  getImages(path: string): void {
    this.isCategoriesView = false;

    this.dataService.getImages(path).subscribe((data) => {
      this.itemText = Constants.IMAGE_TEXT;
      this.title = path;
      this.itemsList = <Image[]>data['images'];
    });
  }
 

  addGallery(name: string) {
    let regex = "/";
    let replacedName = name.replace(regex, "");

    this.dataService.addGallery(replacedName).subscribe((data) => {
      data.imageSource = 'assets/images/gallery.png'; // without thumbnail image
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
      this.backgroundImage = fullSizeImage ? fullSizeImage : thumbnailImage;
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
