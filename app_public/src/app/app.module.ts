import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing/app-routing.module';

import { FrameworkComponent } from './framework/framework.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { ScatterPlotComponent } from './scatter-plot/scatter-plot.component';
import { AboutComponent } from './about/about.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { HtmlLineBreaksPipe } from './html-line-breaks.pipe';

@NgModule({
  declarations: [
    FrameworkComponent,
    HomepageComponent,
    PageHeaderComponent,
    ScatterPlotComponent,
    AboutComponent,
    SideBarComponent,
    HtmlLineBreaksPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [FrameworkComponent]
})
export class AppModule { }
