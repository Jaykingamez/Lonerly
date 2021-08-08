import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignUpInterestsPage } from './sign-up-interests.page';

const routes: Routes = [
  {
    path: '',
    component: SignUpInterestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignUpInterestsPageRoutingModule {}
