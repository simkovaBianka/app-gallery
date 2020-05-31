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
import { SharedService } from './service/shared.service';

import { DragAndDropDirective } from './directive/drag-and-drop.directive';

@NgModule({
  declarations: [
    AppComponent,
    ItemListComponent,
    ItemComponent,
    HeaderComponent,
    DragAndDropDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LazyLoadImageModule.forRoot({
      preset: scrollPreset
    })
  ],
  providers: [DataService, SharedService],
  bootstrap: [AppComponent]
})

export class AppModule { }
