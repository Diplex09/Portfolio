import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationComponent } from './navigation/navigation.component';
import { ProfileDropdownComponent } from './navigation/profile-dropdown/profile-dropdown.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ReportsTableComponent } from './reports-table/reports-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RatingOpinionComponent } from './rating-opinion/rating-opinion.component';
import { RouterModule } from '@angular/router';
import { ConversationComponent } from './conversation/conversation.component';


@NgModule({
  declarations: [
    NavigationComponent,
    CalendarComponent,
    ReportsTableComponent,
    ProfileDropdownComponent,
    RatingOpinionComponent,
    ConversationComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    NgxDatatableModule,
    RouterModule,
  ],
  exports: [
    NavigationComponent,
    CalendarComponent,
    ReportsTableComponent,
    RouterModule,
    FormsModule,
    RatingOpinionComponent,
    ConversationComponent,
  ]
})
export class ComponentsModule { }
