import { Component } from '@angular/core';

import { trigger, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  animations: [
    trigger(
      'enterAnimation',
      [
        transition(':enter',
          [
            style({ transform: 'translateX(100%)', opacity: 0 }),
            animate(250, style({ transform: 'translateX(0)', opacity: 1 }))
          ]
        ),
        // transition(':leave',
        //   [
        //     style({ transform: 'translateX(0)', opacity: 1 }),
        //     animate(150, style({ transform: 'translateX(100%)', opacity: 0 }))
        //   ]
        // )
      ]
    ),
    trigger('fadeInOut',
      [
        transition(':enter',
          [
            style({ opacity: 0 }),
            animate(200, style({ opacity: 1 }))
          ]
        ),
        transition(':leave',
          [
            animate(100, style({ opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class AppComponent {
  constructor() { }
}
