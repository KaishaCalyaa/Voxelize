import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { LearningPage } from './learning.page';

const routes: Routes = [
  {
    path: '',
    component: LearningPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LearningPage,  // Import the standalone component
    RouterModule.forChild(routes)
  ]
})
export class LearningPageModule {}

