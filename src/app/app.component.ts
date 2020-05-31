import { Component } from '@angular/core';
import { Constants } from './shared/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  headerText: string = Constants.HEADER_TEXT;
  footerText: string = Constants.FOOTER_TEXT;
}
