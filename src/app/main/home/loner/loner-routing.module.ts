import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LonerPage } from './loner.page';

const routes: Routes = [
  {
    path: '',
    component: LonerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LonerPageRoutingModule {}
