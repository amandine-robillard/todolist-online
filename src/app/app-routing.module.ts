import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoomComponent }      from './room/room.component';
import { TaskComponent }   from './task/task.component';

const routes: Routes = [
	{ path: '', redirectTo: '/room', pathMatch: 'full' },
	{ path: 'room', component: RoomComponent },
	{ path: 'room/:id', component: TaskComponent },
	{ path: '**', component: RoomComponent }
];

@NgModule({
	exports: [ RouterModule ],
	imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule {}
