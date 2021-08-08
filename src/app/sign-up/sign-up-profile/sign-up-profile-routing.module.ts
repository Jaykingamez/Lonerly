import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignUpProfilePage } from './sign-up-profile.page';

const routes: Routes = [
  {
    path: '',
    component: SignUpProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignUpProfilePageRoutingModule {}
