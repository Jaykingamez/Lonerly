import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { File } from '@ionic-native/File/ngx';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './main-routing.module';

import { MainPage } from './main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainPageRoutingModule
  ],
  declarations: [MainPage],
  providers: [File, Camera],
})
export class MainPageModule {}
