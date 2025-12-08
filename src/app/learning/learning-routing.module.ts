import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningPage } from './learning.page';

const routes: Routes = [
  {
    path: '',
    component: LearningPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearningPageRoutingModule { }

