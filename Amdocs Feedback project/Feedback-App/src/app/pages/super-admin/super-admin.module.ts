import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuperAdminPageRoutingModule } from './super-admin-routing.module';

import { SuperAdminPage } from './super-admin.page';
import { ComponentsModule } from '../../components/components.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuperAdminPageRoutingModule,
    ComponentsModule,
    DragDropModule
  ],
  declarations: [SuperAdminPage]
})
export class SuperAdminPageModule {}
