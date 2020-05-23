import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  headerText: string = 'fotogaléria';
  footerText: string = 'webdesign.bart.sk';

  parentData: any;
}
