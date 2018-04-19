import 'rxjs/add/operator/switchMap';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { RoomService } from '../service/room.service';
import { TaskService } from '../service/task.service';
import { PointService } from '../service/point.service';
import { GatewayService } from '../service/gateway.service';
import { Room } from '../model/room.model';
import { Task } from '../model/task.model';
import { Point } from '../model/point.model';

@Component({
	selector: 'app-task',
	templateUrl: './task.component.html',
	styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
	roomId: string;
	room: Room;
	tasks: Task[];
	message: any;
	subscription: Subscription;

	constructor(
		public roomService: RoomService,
		public taskService: TaskService,
		public pointService: PointService,
		private route: ActivatedRoute,
		private router: Router,
		private gatewayService: GatewayService
	) {
		/** Récupère l'id d'un point en cours de suppression. Supprime le point de la liste */
		this.subscription = this.gatewayService.getPointToDelete().subscribe(pointData => {
			this.deletePointFromList(pointData.parentId, pointData.pointId);
		});
	}

	ngOnInit() {
		this.roomId = this.route.snapshot.paramMap.get('id');
		this.getParentRoom( this.roomId );
		this.getTasks( this.roomId );
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	getParentRoom( roomId ) {
		if ( ! roomId || roomId == undefined ) return;

		this.roomService.getById( roomId ).subscribe(data => {
			this.room = new Room(data[0]);
		})
	}

	getTasks( roomId ) {
		if ( ! roomId || roomId == undefined ) return;

		let filters = {
			parent_room: roomId
		}
		this.taskService.getByFilterDetailed( filters ).subscribe(data => {
			if (!data || data == undefined) return;
			this.tasks = data;
		});
	}

	/**
	 * Add a new task to the list of tasks
	 */
	addTask() {
		if ( ! this.room || this.room == undefined ) return;

		let newTask = new Task({
			'parent_room' : this.room.id
		})
		this.taskService.post(newTask).subscribe(data => {
			if( data == undefined || data.id == undefined ) return;
			this.tasks.push(new Task(data));
		})
	}

	/**
	 * Add a new point in the list
	 */
	addPoint(task) {
		if ( ! task || task == undefined ) return;

		let newPoint = new Point({
			'title' : 'Nouveau point',
			'parent_task' : task.id
		})
		this.pointService.post(newPoint).subscribe(data => {
			if( data == undefined || data._id == undefined ) return;
			task.list_point.push(new Point(data));
		})
	}

	/** Delete a task */
	deleteTask(task) {
		if ( ! task || task == undefined ) return;
		let taskId = task.id;

		this.taskService.delete(taskId).subscribe(data => {
			for (var i = 0; i < this.tasks.length; i++) {
				if (this.tasks[i].id == taskId) {
					this.tasks.splice(i, 1);
				}
			}
		})
	}

	/** Supprime le point de this.tasks */
	deletePointFromList(parentId, pointId) {
		if ( ! parentId || parentId == undefined ) return;
		if ( ! pointId || pointId == undefined ) return;

		let index;

		for (var i = 0; i < this.tasks.length; i++) {
			if (this.tasks[i].id == parentId) {
				index = i;
			}
		}

		for (var i = 0; i < this.tasks[index].list_point.length; i++) {
			if (this.tasks[index].list_point[i]._id == pointId) {
				this.tasks[index].list_point.splice(i, 1);
			}
		}

	}


}
