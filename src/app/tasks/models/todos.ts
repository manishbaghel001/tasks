import { v4 as uuidv4 } from 'uuid';
export class TodosModel {
    name: string;
    id: string;
    todoId: string;
    completed: boolean;
    deleted: boolean

    setModel(id: string, name?: string, completed?: boolean, deleted?: boolean, todoId?: string) {
        this.name = name;
        this.id = id;
        this.todoId = todoId ? todoId : uuidv4();
        this.completed = completed ? completed : false;
        this.deleted = deleted ? deleted : false;
    }
}