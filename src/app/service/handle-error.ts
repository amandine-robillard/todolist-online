import { Observable } from 'rxjs/Observable';
import { of as observableOf } from 'rxjs/observable/of'
import { catchError, map, tap } from 'rxjs/operators';

export class HandleError {
	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	public return<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {

			// TODO: send the error to remote logging infrastructure
			// console.error(error); // log to console instead

			/** Return the api error message if exists */
			if ( error.error.message != undefined ) {
				alert(error.error.message);
			}

			// Let the app keep running by returning an empty result.
			return observableOf(result as T);
		};
	}
}
