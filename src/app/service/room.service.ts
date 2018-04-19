import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';

import { Room } from './../model/room.model';
import { TaskService } from './task.service';
import { HandleError } from './handle-error';

@Injectable()
export class RoomService {
	constructor(
		private http: HttpClient,
		private handleError: HandleError,
		private taskService: TaskService
	) { }

	private roomApiUrl = 'http://localhost:3000/api/room/';

	/** GET rooms */
	get(): Observable<Room[]> {
		return this.http.get<Room[]>(this.roomApiUrl)
		.pipe(
			tap(rooms => {
				for (var f in rooms) {
					rooms[f] = new Room(rooms[f]);
				}
			}),
			catchError(this.handleError.return('getRooms', []))
		);
	}

	getById( roomId ): Observable<Room> {
		return this.http.get<any>(this.roomApiUrl + roomId)
		.pipe(
			catchError(this.handleError.return('getRoomById'))
		);
	}

	/** POST room */
	post( room: Room ): Observable<Room> {
		let httpOptions = {
		  headers: new HttpHeaders({
		    'Content-Type':  'application/json'
		  })
		};

		return this.http.post<any>(this.roomApiUrl, room, httpOptions)
		.pipe(
			catchError(this.handleError.return('postRoom'))
		)
	}

	/** DELETE single room */
	delete( roomId ): Observable<Room> {
		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json'
			}),
			body: {
				id: roomId
			}
		};

		this.taskService.deleteByRoom(roomId).subscribe(data => {});
		return this.http.request<any>('delete', this.roomApiUrl, httpOptions)
		.pipe(
			tap(data => {}),
			catchError(this.handleError.return('deleteRoom'))
		)
	}

}
