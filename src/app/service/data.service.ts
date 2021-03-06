import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { Constants } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  baseUrl: string = Constants.BASE_URL;

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  /**
   * Get all galleries with number of images.
   */
  getAllGalleriesData(): Observable<any> {
    return this.getGalleries().pipe(
      switchMap((galleries: any) => {
        const obs$ = galleries['galleries'].map(item => {

          return this.getImages(item.path)
            .pipe(
              catchError(err => {
                return of(err);
              })
            );
        });
        return forkJoin(obs$)
          .pipe(
            mergeMap((listOfGalleriesWithImages: any) => {
              galleries['galleries'].forEach((element, index) => {
                element.size = listOfGalleriesWithImages[index].images.length;
              });
              return of(galleries);
            })
          );
      })
    );
  }

  /**
   * Get all galleries.
   */
  getGalleries(): Observable<any> {
    const requestUrl = `${this.baseUrl}/gallery`;

    return this.http.get(requestUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get all images from the gallery.
   * @param path - Name(path) of gallery
   */
  getImages(path: string): Observable<any> {
    const requestUrl = `${this.baseUrl}/gallery/${path}`;

    return this.http.get(requestUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get image object (blob).
   * @param path - Image name(path)
   * @param width - Image width, default 0, calculated according to the height while maintaining the aspect ratio
   * @param heigth - Image height, default 0, calculated according to the width while maintaining the aspect ratio
   */
  getImage(path: string, width: number = 0, heigth: number = 0): Observable<Blob> {
    const requestUrl = `${this.baseUrl}/images/${width}x${heigth}/${path}`;

    return this.http.get(requestUrl, { responseType: 'blob' }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Add new gallery to list of galleries.
   * @param name - Name of created gallery
   */
  addGallery(name: string): Observable<any> {
    const requestUrl = `${this.baseUrl}/gallery`;

    const data = { 'name': name };
    return this.http.post(requestUrl, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Upload one image to the gallery.
   * @param path - Image name(path)
   * @param image - Image object(File)
   */
  addImage(path: string, image: File): Observable<any> {
    const requestUrl = `${this.baseUrl}/gallery/${path}`;

    const data = new FormData();
    data.append('image', image);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data; boundary=--boundary'
      })
    };

    return this.http.post(requestUrl, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
}
