import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() { }

  toggleTheme(event: any) {
    const dark = event.detail.checked || false;
    document.body.setAttribute('color-theme', (dark ? 'dark' : 'light'));
  }

}
