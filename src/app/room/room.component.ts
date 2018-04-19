import { Component, OnInit } from '@angular/core';

import { RoomService } from '../service/room.service';
import { TaskService } from '../service/task.service';
import { Room } from '../model/room.model';

@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
	rooms: Room[];
	roomFilter: string = '';

	constructor(
		public roomService: RoomService,
		public taskService: TaskService
	) { }

	ngOnInit() {
		this.roomService.get().subscribe(data => {
			this.rooms = data;
			for (var i = 0; i < this.rooms.length; i++) {
				this.getTaskNumber(this.rooms[i]);
			}
		})
	}

	/**
	 * Add a new room to the list of rooms
	 */
	addRoom() {
		this.roomService.post(new Room({})).subscribe(data => {
			if( data == undefined || data.id == undefined ) return;
			this.rooms.push(new Room(data));
		})
	}

	/**
	 * Delete a single Room
	 */
	deleteRoom( room ) {
		event.stopPropagation();
		if( ! room || room.length == 0 ) return;

		this.roomService.delete(room.id).subscribe(data => {
			for (var i = 0; i < this.rooms.length; i++) {
				if (this.rooms[i].id == data.id) {
					this.rooms.splice(i, 1);
				}
			}
		})
	}

	/**
	 * Return number of tasks in all rooms
	 *
	 */
	getTaskNumber( room ) {
		this.taskService.getByFilter({ parent_room: room.id }).subscribe(data => {
			room['task_count'] = data.length;
		});
	}

}
