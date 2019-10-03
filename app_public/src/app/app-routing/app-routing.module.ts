import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // add this

// add all the components you are going to reference
import { HomepageComponent } from '../homepage/homepage.component';


const routes: any = [ // <router-outlet> in framework.component.html
  {
    path: '',
    component: HomepageComponent
  }];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
