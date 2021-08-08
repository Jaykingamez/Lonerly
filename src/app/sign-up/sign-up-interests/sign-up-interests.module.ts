import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignUpInterestsPageRoutingModule } from './sign-up-interests-routing.module';

import { SignUpInterestsPage } from './sign-up-interests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SignUpInterestsPageRoutingModule
  ],
  declarations: [SignUpInterestsPage]
})
export class SignUpInterestsPageModule {}
