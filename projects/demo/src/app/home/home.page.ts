import { Component } from "@angular/core";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  title = `@heliomarpm/ion-calendar - ${environment.version}`;

  constructor() { }

  toggleTheme(event: any) {
    const dark = event.detail.checked || false;
    document.body.setAttribute("color-theme", dark ? "dark" : "light");
  }
}
