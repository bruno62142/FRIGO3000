import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject,AngularFireList } from '@angular/fire/compat/database';
import {map} from 'rxjs';
import {ESP32_Data} from './model' 
import flatpickr from 'flatpickr';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})

export class AppComponent implements OnInit{
  title= 'FRIGO3000';
  private historyRef: AngularFireList<ESP32_Data>;
  private currentRef: AngularFireObject<ESP32_Data>;
  private history_DefRef: AngularFireList<ESP32_Data>;

  public history?: ESP32_Data[];
  public history_def?: ESP32_Data[];
  public current?: ESP32_Data|null;
  public chart_t: any;
  public chart_h:any;

  constructor(db: AngularFireDatabase){
    this.historyRef= db.list<ESP32_Data>('/history');
    this.history_DefRef= db.list<ESP32_Data>('/history_def');
    this.currentRef= db.object<ESP32_Data>('/current');

  }


  ngOnInit(): void{
   
    this.history_DefRef
    .snapshotChanges()
    .pipe(map((changes) => changes.map((c) => ({ ...c.payload.val()}))))
    .subscribe((data) => {
      this.history_def=data; 
  
    });
    this.historyRef
    .snapshotChanges()
    .pipe(map((changes) => changes.map((c) => ({ ...c.payload.val()}))))
    .subscribe((data) => {
      this.history=data; 
      this.current=data[data.length-1];
     // this.createLineChart()
    });
    this.currentRef.snapshotChanges().subscribe((data) => {
      this.current=data.payload.val();
    })
    flatpickr("#datetimepicker-dashboard", {
      inline: true,
      prevArrow: "<span title='Mois précédent'>&laquo;</span>",
      nextArrow: "<span title='Mois suivant'>&raquo;</span>",
      defaultDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    });
  }
  createLineChart() {
    if(this.history) {

       // Récupérer les données de température de l'historique
    let temperatureData = this.history.map(data => data.temperature);
    // Récupérer les données d'humidité de l'historique
    //let humidityData = this.history.map(data => data.humidity);

    // Récupérer les heures de l'historique
    let labels = this.history.map(data => data.time);
        this.chart_t = new Chart("chartjs-dashboard-line", {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
            {
                label: "temperature",
                data: temperatureData,
                backgroundColor: 'red'
            }
            ]
        },
        options: {
            aspectRatio:2.5
        }
        });

        /*this.chart_h = new Chart("chartjs-dashboard-bar", {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
            {
                label: "Humidité",
                data: humidityData,
                backgroundColor: 'blue'
            }
            ]
        },
        options: {
            aspectRatio:2.5
        }
        });*/
    }
}


  

} 

  

  