import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private viewData = new BehaviorSubject({
    "title": "",
    "isCategoriesView": true
  });
  currentViewData = this.viewData.asObservable();

  private backgroundImageSource = new BehaviorSubject("assets/images/noimage.svg");
  currentbackgroundImageSource = this.backgroundImageSource.asObservable();

  constructor() { }

  changeViewData(data: { "title": string, "isCategoriesView": boolean }) {
    this.viewData.next(data);
  }

  changeBackgroundImage(source: string) {
    this.backgroundImageSource.next(source);
  }
}
