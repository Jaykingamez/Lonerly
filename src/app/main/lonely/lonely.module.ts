import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LonelyPageRoutingModule } from './lonely-routing.module';

import { LonelyPage } from './lonely.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LonelyPageRoutingModule
  ],
  declarations: [LonelyPage]
})
export class LonelyPageModule {}
