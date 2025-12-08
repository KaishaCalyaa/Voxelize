import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IotAiModulePage } from './iot-ai-module.page';

const routes: Routes = [
  {
    path: '',
    component: IotAiModulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IotAiModulePageRoutingModule {}

