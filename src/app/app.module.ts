import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { LazyLoadImageModule, scrollPreset } from 'ng-lazyload-image'; 

import { AppComponent } from './app.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemComponent } from './components/item/item.component';
import { HeaderComponent } from './components/header/header.component';

import { DataService } from './service/data.service';

import { DragAndDropDirective } from './directive/drag-and-drop.directive';

@NgModule({
  declarations: [
    AppComponent,
    ItemListComponent,
    DragAndDropDirective,
    ItemComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LazyLoadImageModule.forRoot({
      preset: scrollPreset
    })
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})

export class AppModule { }
