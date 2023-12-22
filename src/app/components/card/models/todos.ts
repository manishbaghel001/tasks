export class TodosModel {
    name: string;
    id: string;
    completed: boolean;
    deleted: boolean

    setModel(id: string, name?: string, completed?: boolean, deleted?: boolean) {
        this.name = name;
        this.id = id;
        this.completed = completed ? completed : false;
        this.deleted = deleted ? deleted : false;
    }
}