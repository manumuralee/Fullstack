import { User } from "./user";
import { Project } from "./project";
import { ParentTask } from "./parent-task";

export interface ModelSearch {
    title: string;
    searchType: string;

    users: User[];    
    projects: Project[];
    parents: ParentTask[];
    
}