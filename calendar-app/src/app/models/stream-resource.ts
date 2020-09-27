import { BehaviorSubject, Observable } from 'rxjs';

export class Resource {
    private loading = false;
    private behaviorSubject: BehaviorSubject<any>;
    public readonly obs: Observable<any>;

    constructor(defaultValue?: any) {
        this.behaviorSubject = new BehaviorSubject(defaultValue);
        this.obs = this.behaviorSubject.asObservable();
    }

    request(method: any): void {
        if (method && !this.loading) {
            this.loading = true;
            method().toPromise().then((data: any) => {
                if (data) { this.update(data); }
                this.loading = false;
            });
        }
    }

    getValue(): any {
        return this.behaviorSubject.getValue();
    }

    update(data: any): void {
        this.behaviorSubject.next(data);
    }

    refresh(): void {
        const data = this.getValue();
        if (data) { this.update(data); }
    }

    clear(): void {
        this.behaviorSubject.next(null);
    }
}
