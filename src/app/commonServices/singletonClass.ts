/*export class SessionStorage
{
    message:string;
    storage:any={};
    static instance:SessionStorage;
    static isCreating:boolean = false;

    constructor() {
        if (!SessionStorage.isCreating) {
            throw new Error("You can't call new in Singleton instances! Call SingletonService.getInstance() instead.");
        }
    }

    static getInstance() {
        if (SessionStorage.instance == null) {
            SessionStorage.isCreating = true;
            SessionStorage.instance = new SessionStorage();
            SessionStorage.isCreating = false;
        }

        return SessionStorage.instance;
    }

    setItem(key:string, value:string) {
        this.storage[key]=value;
    }

    getItem(key:string) {
        return this.storage[key];
    }

    deleteItem(key:string) {
        delete this.storage[key];
        return true;
    }

    clear(){
        console.log("SessionStorage Cleared...");
        this.storage={};
    }
}*/