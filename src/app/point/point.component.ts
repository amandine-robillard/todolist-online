import { Component, OnInit, Input } from '@angular/core';

import { PointService } from '../service/point.service';
import { GatewayService } from '../service/gateway.service';
import { Point } from '../model/point.model';

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.scss']
})
export class PointComponent implements OnInit {
	@Input('point') point: Point;

	constructor(
		public pointService: PointService,
		private gatewayService: GatewayService
	) {}

	ngOnInit() {
	}

	/** Delete a task */
	deletePoint(point) {
		if ( ! point || point == undefined ) return;
		let pointId = point._id;
		let parentId = point.parent_task;

		/* Envoyer egalement l'id de la tâche parente */
		this.gatewayService.sendPointToDelete(parentId, pointId);

		this.pointService.delete(pointId).subscribe();
	}

	completePoint(point) {
		if ( point.status == 'publish' ) {
			point.status = 'archive';
		} else if( point.status == 'archive' ) {
			point.status = 'publish';
		}

		this.pointService.updateStatusPoint(point).subscribe();
	}
}
