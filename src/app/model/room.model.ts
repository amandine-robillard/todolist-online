export class Room {
	id: string;
	title: string;
	description: string;
	task_count: number = 0;

	constructor(fields: any) {
		for (const f in fields) {
			this[f] = fields[f];
		}
	}
}
