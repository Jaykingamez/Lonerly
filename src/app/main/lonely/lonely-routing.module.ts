import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LonelyPage } from './lonely.page';

const routes: Routes = [
  {
    path: '',
    component: LonelyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LonelyPageRoutingModule {}
