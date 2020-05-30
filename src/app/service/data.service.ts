import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from, forkJoin, of } from 'rxjs';
import { catchError, mergeMap, toArray, map, switchMap } from 'rxjs/operators';
import { Gallery } from '../model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  BASE_URL: string = 'http://api.programator.sk';
  //BASE_URL: string = 'http://localhost:8010/proxy';

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
  };

  getAllGalleriesData(): Observable<Object> {
    return this.getGalleries().pipe(
      switchMap((galleries: any) => {
        //this.itemsList = <Gallery[]>galleries['galleries'];
        const obs$ = galleries['galleries'].map(item => {

          return this.getImages(item.path)
            .pipe(
              catchError(err => {
                return of(err);
              })
            )
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
    )
  }

  getGalleries(): Observable<Object> {
    let requestUrl: string = `${this.BASE_URL}/gallery`;

    return this.http.get(requestUrl).pipe(
      catchError(this.handleError)
    );
  }

  getImages(path: string): Observable<Object> {
    let requestUrl: string = `${this.BASE_URL}/gallery/${path}`;

    return this.http.get(requestUrl).pipe(
      catchError(this.handleError)
    );
  }

  getImage(path: string, width: number = 0, heigth: number = 0): Observable<Blob> {
    let requestUrl: string = `${this.BASE_URL}/images/${width}x${heigth}/${path}`;

    return this.http.get(requestUrl, { responseType: 'blob' }).pipe(
      catchError(this.handleError)
    );
  }

  addGallery(name: string): Observable<any> {
    let requestUrl: string = `${this.BASE_URL}/gallery`;

    let data = { 'name': name };
    return this.http.post(requestUrl, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  addImage(path: string, image: File): Observable<any> {
    let requestUrl: string = `${this.BASE_URL}/gallery/${path}`;

    let data = new FormData();
    data.append('image', image);

    let httpOptions = {
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
