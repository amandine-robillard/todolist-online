import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GatewayService {
	private subject = new Subject<any>();

	sendPointToDelete(parentId: string, pointId: string) {
		if ( ! pointId || pointId == undefined ) return;
		this.subject.next({ parentId: parentId, pointId: pointId });
	}

	getPointToDelete(): Observable<any> {
		return this.subject.asObservable();
	}
}
