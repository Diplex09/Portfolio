import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GradePage } from './grade.page';

const routes: Routes = [
  {
    path: '',
    component: GradePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GradePageRoutingModule {}
