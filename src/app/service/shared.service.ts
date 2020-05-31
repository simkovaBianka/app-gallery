import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Constants } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  /**
   * Service for storing and updating shared data.
   */

  private viewData = new BehaviorSubject({
    title: '',
    isCategoriesView: true
  });
  private backgroundImageSource = new BehaviorSubject(Constants.DEFAULT_IMAGE);

  currentViewData = this.viewData.asObservable();
  currentbackgroundImageSource = this.backgroundImageSource.asObservable();

  constructor() { }

  changeViewData(data: { title: string, isCategoriesView: boolean }) {
    this.viewData.next(data);
  }

  changeBackgroundImage(source: string) {
    this.backgroundImageSource.next(source);
  }
}
