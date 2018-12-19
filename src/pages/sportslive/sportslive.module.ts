import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SportslivePage } from './sportslive';

@NgModule({
  declarations: [
    SportslivePage,
  ],
  imports: [
    IonicPageModule.forChild(SportslivePage),
  ],
})
export class SportslivePageModule {}
