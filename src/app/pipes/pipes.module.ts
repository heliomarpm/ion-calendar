import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JsonPrettyPipe } from './jsonpretty.pipe';

@NgModule({
  imports: [CommonModule],
  exports: [JsonPrettyPipe],
  declarations: [JsonPrettyPipe],
})
export class PipesModule { }
