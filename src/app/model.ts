import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject,AngularFireList } from '@angular/fire/compat/database';
import {map} from 'rxjs';
import {ESP32_Data} from '../models' 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})

export class AppComponent implements OnInit{
  private historyRef: AngularFireList<ESP32_Data>;
  private currentRef: AngularFireObject<ESP32_Data>;
  constructor(db: AngularFireDatabase){
    this.historyRef= db.list<ESP32_Data>('/history');
    this.currentRef= db.object<ESP32_Data>('/current');
  }


  ngOnInit(): void{
    this.historyRef
    .snapshotChanges()
    .pipe(map((changes) => changes.map((c) => ({ ...c.payload.val()}))))
    .subscribe((data) => {
      this.history=data; 
      this.current=data[data.length-1]
    });
    this.currentRef.snapshotChanges().subscribe((data) => {
      //this.current=data.payload.val();
    })
  }

  }

