import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CalendarModalComponent, ICalendarModalOptions, IDayConfig, ICalendarResult } from '@heliomarpm/ion-calendar';

@Component({
  selector: 'app-demo-modal-config-days',
  templateUrl: './demo-modal-config-days.component.html',
  styleUrls: ['./demo-modal-config-days.component.scss'],
})
export class DemoModalConfigDaysComponent {
  private year = (new Date()).getFullYear();
  private date = this.calculateEasterDate(this.year);

  constructor(public modalCtrl: ModalController) { }

  /**
   * Calculate the date of Easter for the given year.
   *
   * @param {number} year - The year for which to calculate the Easter date.
   * @return {Date} The date of Easter for the given year.
   */
  private calculateEasterDate(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(year, month - 1, day);
  }

  private getHolidays(year: number): IDayConfig[] {
    const holidays: IDayConfig[] = [];

    // Adicione os feriados fixos que não mudam de ano para ano
    holidays.push({ date: new Date(year, 0, 1), title: '🎉', cssClass: 'my-day', subTitle: 'New Year' });
    holidays.push({ date: new Date(year, 4, 1), subTitle: '👷', disable: true, });
    holidays.push({ date: new Date(year, 11, 25), subTitle: '🎅', disable: true, });

    // Adicione os feriados móveis que dependem da data da Páscoa (exemplo: Sexta-feira Santa)
    const easterDate = this.calculateEasterDate(year);
    holidays.push({ date: easterDate, subTitle: 'Easter' })
    holidays.push({ date: new Date(easterDate.getFullYear(), easterDate.getMonth(), easterDate.getDate() - 2), subTitle: '✝️', disable: true });

    return holidays;
  }

  async openCalendar() {

    const daysConfig = this.getHolidays(this.year);

    const options: ICalendarModalOptions = {
      daysConfig,
      from: new Date(this.year, 0, 1),
      to: new Date(this.year, 11, 31),
      title: 'CONFIG DAYS',
      defaultDate: this.date,
      defaultScrollTo: this.date,
      color: 'warning',
      colorSubtitle: 'warning'
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModalComponent,
      componentProps: { options },
    });

    myCalendar.present();

    const event = await myCalendar.onDidDismiss();
    const { data, role } = event;

    if (role === 'done') {
      const date = data as ICalendarResult;
      this.date = date.dateObj;

      alert(`date: ${date.string}\n\n role: ${role}`);
    }

    console.log('date', data);
    console.log('role', role);
  }
}
