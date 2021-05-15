import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

import { DemosModule } from '../demos/demos.module';
import { IonCalendarModule } from 'projects/ion-calendar/src/lib';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    IonCalendarModule,
    DemosModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
