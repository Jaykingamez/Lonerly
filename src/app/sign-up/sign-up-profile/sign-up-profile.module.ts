import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Camera } from '@ionic-native/Camera/ngx';
import { IonicModule } from '@ionic/angular';

import { SignUpProfilePageRoutingModule } from './sign-up-profile-routing.module';

import { SignUpProfilePage } from './sign-up-profile.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SignUpProfilePageRoutingModule
  ],
  declarations: [SignUpProfilePage],
  providers: [Camera],
})
export class SignUpProfilePageModule {}
