export class Point {
	_id: string;
	title: string;
	status: string;
	parent_task: string;

	constructor(fields: any) {
		for (const f in fields) {
			this[f] = fields[f];
		}
	}
}
