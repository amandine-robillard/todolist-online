import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';

import { Point } from './../model/point.model';
import { HandleError } from './handle-error';

@Injectable()
export class PointService {
	constructor(private http: HttpClient, private handleError: HandleError) { }

	private pointApiUrl = 'http://localhost:3000/api/point/';

	getByFilter( filters ): any {
		let url = '';
		if( filters ) {
			/** Construit l'url */
			for(let f in filters) {
				url += f + '=' + filters[f] + '&';
			}
			url = url.slice(0, -1);
		}

		return this.http.get<Point[]>(this.pointApiUrl + 'filter/' + url)
		.pipe(
			tap(points => {
				for (var f in points) {
					points[f] = new Point(points[f]);
				}
			}),
			catchError(this.handleError.return('getPointsByFilter', []))
		);
	}

	/** POST task */
	post( point: Point ): Observable<Point> {
		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json'
			})
		};

		return this.http.post<any>(this.pointApiUrl, point, httpOptions)
		.pipe(
			catchError(this.handleError.return('postPoint'))
		)
	}

	updateStatusPoint( point: Point ): Observable<Point> {
		if ( ! point || point == undefined ) return;
		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json'
			}),
			body: {
				id: point._id,
				status: point.status
			}
		};

		return this.http.request<any>('put', this.pointApiUrl, httpOptions)
		.pipe(
			tap(data => {}),
			catchError(this.handleError.return('updateStatusPoint'))
		)
	}

	/** DELETE point */
	delete( pointId ): Observable<Point> {
		if ( ! pointId || pointId == undefined ) return;
		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json'
			}),
			body: {
				id: pointId
			}
		};

		return this.http.request<any>('delete', this.pointApiUrl, httpOptions)
		.pipe(
			tap(data => {}),
			catchError(this.handleError.return('deletePoint'))
		)
	}

	/** DELETE points from a task parent */
	deleteByTask( taskId ): Observable<any> {
		if ( ! taskId || taskId == undefined ) return;
		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json'
			}),
			body: {
				id: taskId
			}
		};

		return this.http.request<any>('delete', this.pointApiUrl + 'parent/', httpOptions)
		.pipe(
			tap(data => {}),
			catchError(this.handleError.return('deleteTasksByRoom'))
		)
	}

}
