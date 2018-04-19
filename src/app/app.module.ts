import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RoomComponent } from './room/room.component';
import { TaskComponent } from './task/task.component';
import { PointComponent } from './point/point.component';

import { HandleError } from './service/handle-error';
import { RoomService } from './service/room.service';
import { TaskService } from './service/task.service';
import { PointService } from './service/point.service';
import { GatewayService } from './service/gateway.service';
import { FilterPipe } from './pipe/filter.pipe';

@NgModule({
  declarations: [
		AppComponent,
		RoomComponent,
		TaskComponent,
		PointComponent,
		FilterPipe
  ],
  imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule
  ],
  providers: [
		HandleError,
		RoomService,
		TaskService,
		PointService,
		GatewayService
	],
  bootstrap: [AppComponent]
})
export class AppModule { }
