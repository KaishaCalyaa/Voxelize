import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IotAiModulePageRoutingModule } from './iot-ai-module-routing.module';

import { IotAiModulePage } from './iot-ai-module.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IotAiModulePageRoutingModule,
    IotAiModulePage
  ]
})
export class IotAiModulePageModule {}

