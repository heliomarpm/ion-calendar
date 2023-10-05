import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

import { DemosModule } from '../demos/demos.module';
import { IonCalendarModule } from '@heliomarpm/ion-calendar';

@NgModule({
  declarations: [HomePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    DemosModule,
    IonCalendarModule
  ]
})
export class HomePageModule { }
