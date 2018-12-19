import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayerembedPage } from './playerembed';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    PlayerembedPage,
  ],
  imports: [
    IonicPageModule.forChild(PlayerembedPage),
    PipesModule
  ],
})
export class PlayerembedPageModule {}
