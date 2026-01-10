import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  // Data to pass to the modal (optional)
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  constructor() {}

  open(data: any = null) {
    this.dataSubject.next(data);
    this.isOpenSubject.next(true);
  }

  close() {
    this.isOpenSubject.next(false);
    this.dataSubject.next(null);
  }
}
