export class Task {
	id: string;
	title: string;
	parent_room: string;
	list_point: any;

	constructor(fields: any) {
		for (const f in fields) {
			this[f] = fields[f];
		}
	}
}
