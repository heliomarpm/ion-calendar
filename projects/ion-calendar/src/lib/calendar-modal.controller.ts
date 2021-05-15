import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';

import { CalendarModalOptions, ModalOptions } from './calendar.models';
import { CalendarService } from './calendar.service';
import { CalendarModalComponent } from './components/calendar-modal.component';

@Injectable()
export class CalendarModalController {
    constructor(public modalCtrl: ModalController, public calSvc: CalendarService) { }

    /**
     * @deprecated
     * @param {CalendarModalOptions} calendarOptions
     * @param {ModalOptions} modalOptions
     * @returns {any}
     */
    async openCalendar(calendarOptions: CalendarModalOptions, modalOptions: ModalOptions = {}): Promise<{}> {
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
