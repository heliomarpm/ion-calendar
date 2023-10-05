import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ICalendarModalOptions } from './models/ICalendarOptions';
import { IModalOptions } from './models/IModalOptions';
import { IonCalendarService } from './ion-calendar.service';
import { CalendarModalComponent } from './components';

@Injectable()
export class CalendarModalController {
    constructor(public modalCtrl: ModalController, public calSvc: IonCalendarService) { }

    /**
     * @deprecated
     * @param {ICalendarModalOptions} calendarOptions
     * @param {IModalOptions} modalOptions
     * @returns {any}
     */
    async openCalendar(calendarOptions: ICalendarModalOptions, modalOptions: IModalOptions = {}): Promise<{}> {
        const options = this.calSvc.safeOpt(calendarOptions);

        const calendarModal = await this.modalCtrl
            .create({
                component: CalendarModalComponent,
                componentProps: {
                    options,
                },
                ...modalOptions,
            });
        calendarModal.present();
        const event = await calendarModal.onDidDismiss();
        return await (event.data ? Promise.resolve(event.data) : Promise.reject('cancelled'));
    }
}
