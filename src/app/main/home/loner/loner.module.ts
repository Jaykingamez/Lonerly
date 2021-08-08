import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LonerPageRoutingModule } from './loner-routing.module';

import { LonerPage } from './loner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LonerPageRoutingModule
  ],
  declarations: [LonerPage]
})
export class LonerPageModule {}
