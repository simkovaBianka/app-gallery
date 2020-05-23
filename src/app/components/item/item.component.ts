import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Image, Gallery } from '../../model';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.sass'],
  providers: [DataService]
})
export class ItemComponent implements OnInit {

  @Input() index: number;
  @Input() isCategoriesView: boolean;
  @Input() itemsList: (Image | Gallery)[];

  @Output() backgroundImageChange: EventEmitter<string> = new EventEmitter();

  defaultImage = "assets/images/gallery.png";

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {

    let path: string = this.isCategoriesView ? ((<Gallery>this.itemsList[this.index]).image?.fullpath || '')
      : (<Image>this.itemsList[this.index]).fullpath;

    path ? this.getImageObject(this.index, path) : '';
  }

  getImageObject(index: number, imagePath: string) {
    this.dataService.getImage(imagePath, 270, 222).subscribe((blob) => {
      var reader = new FileReader();
      reader.readAsDataURL(blob)
      reader.onload = () => {
        this.itemsList[index].thumbnailImage = <string>reader.result;

        if (index == 0) {
          this.backgroundImageChange.emit(<string>reader.result);
        }
      }
    });

    this.dataService.getImage(imagePath, 0, 350).subscribe((blob) => {
      var reader = new FileReader();
      reader.readAsDataURL(blob)
      reader.onload = () => {
        this.itemsList[index].realSizeImage = <string>reader.result;

        if (index == 0) {
          this.backgroundImageChange.emit(<string>reader.result);
        }
      }
    });
  }


  openImageCarousel() {
    (<HTMLElement>document.getElementById("openModalButton")).click();
  }

  navigate(url: string, name: string) {
    if (this.isCategoriesView) {
      let myurl = `${url}/${name}`;
      this.router.navigateByUrl(myurl).then(e => {
        if (e) {
          console.log("Navigation is successful!");
        } else {
          console.log("Navigation has failed!");
        }
      });
    }
  }

}
