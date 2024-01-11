import { v4 as uuidv4 } from 'uuid';
export class TasksModel {
    name: string;
    id: string;
    deleted: boolean

    setModel(id?: string, name?: string, deleted?: boolean) {
        this.name = name;
        this.id = id ? id : uuidv4();
        this.deleted = deleted ? deleted : false;
    }
}