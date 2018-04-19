import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';

import { Task } from './../model/task.model';
import { PointService } from './point.service';
import { HandleError } from './handle-error';

@Injectable()
export class TaskService {
	constructor(
		private http: HttpClient,
		private handleError: HandleError,
		private pointService: PointService
	) { }

	private taskApiUrl = 'http://localhost:3000/api/task/';

	getByFilter( filters ): any {
		let url = '';
		if( filters ) {
			/** Construit l'url */
			for(let f in filters) {
				url += f + '=' + filters[f] + '&';
			}
			url = url.slice(0, -1);
		}

		return this.http.get<Task[]>(this.taskApiUrl + 'filter/' + url)
		.pipe(
			tap(tasks => {
				for (var f in tasks) {
					tasks[f] = new Task(tasks[f]);
				}
			}),
			catchError(this.handleError.return('getTasksByFilter', []))
		);
	}

	getByFilterDetailed( filters ): Observable<Task[]> {
		let url = '';
		if( filters ) {
			/** Construit l'url */
			for(let f in filters) {
				url += f + '=' + filters[f] + '&';
			}
			url = url.slice(0, -1);
		}

		return this.http.get<Task[]>(this.taskApiUrl + 'filter/' + url + '/detail')
		.pipe(
			tap(tasks => {
				for (var f in tasks) {
					tasks[f] = new Task(tasks[f]);
				}
			}),
			catchError(this.handleError.return('getTasksByFilterDetailed', []))
		);
	}

	/** POST task */
	post( task: Task ): Observable<Task> {
		if ( ! task || task == undefined ) return;
		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json'
			})
		};

		return this.http.post<any>(this.taskApiUrl, task, httpOptions)
		.pipe(
			catchError(this.handleError.return('postTask'))
		)
	}

	/** DELETE task */
	delete( taskId ): Observable<Task> {
		if ( ! taskId || taskId == undefined ) return;
		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json'
			}),
			body: {
				id: taskId
			}
		};

		/** Delete associated points */
		this.pointService.deleteByTask(taskId).subscribe();

		return this.http.request<any>('delete', this.taskApiUrl, httpOptions)
		.pipe(
			tap(data => {}),
			catchError(this.handleError.return('deleteTask'))
		)
	}

	/** DELETE tasks from a room parent */
	deleteByRoom( roomId ): Observable<any> {
		if ( ! roomId || roomId == undefined ) return;
		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json'
			}),
			body: {
				id: roomId
			}
		};

		/** Gets tasks ID to delete their points */
		this.getByFilter({parent_room: roomId}).subscribe(tasks => {
			let idTasks = [];
			for (var i = 0; i < tasks.length; i++) {
				idTasks[i] = tasks[i].id;
			}
			this.pointService.deleteByTask(idTasks).subscribe();
		});

		/** Deletes tasks */
		return this.http.request<any>('delete', this.taskApiUrl + 'parent/', httpOptions)
		.pipe(
			tap(data => {}),
			catchError(this.handleError.return('deleteTasksByRoom'))
		)
	}

}
