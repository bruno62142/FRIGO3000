import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject,AngularFireList } from '@angular/fire/compat/database';
import {map} from 'rxjs';
import {ESP32_Data} from './model' 
import flatpickr from 'flatpickr';
import Chart from 'chart.js/auto';
import { Renderer2 } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})

export class AppComponent implements OnInit{
  title= 'FRIGO3000';
  private historyRef: AngularFireList<ESP32_Data>;
  private test: AngularFireList<ESP32_Data>;
  private currentRef: AngularFireObject<ESP32_Data>;
  private history_DefRef: AngularFireList<ESP32_Data>;

  public history?: ESP32_Data[];
  public history_def?: ESP32_Data[];
  public current?: ESP32_Data|null;
  public chart_t?: any;
  public chart_h?:any;
  public selectedOption?: string;
  public temperature?:ESP32_Data[];

  constructor(db: AngularFireDatabase,private renderer: Renderer2){
    this.historyRef= db.list<ESP32_Data>('/history');
    this.history_DefRef= db.list<ESP32_Data>('/history_def');
    this.currentRef= db.object<ESP32_Data>('/current');
    this.test=db.list<ESP32_Data>('/history/temperature');

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
      this.createLineChart()
    });
    this.test
    .snapshotChanges()
    .pipe(map((changes) => changes.map((c) => ({ ...c.payload.val()}))))
    .subscribe((data) => {
      this.temperature=data; 
      
    });
    this.currentRef.snapshotChanges().subscribe((data) => {
      this.current=data.payload.val();
      if(this.current && this.current.TempThermostat) {
        let thermoInput = <HTMLInputElement>document.getElementById("thermo");
        if(thermoInput){
          thermoInput.value = this.current.TempThermostat.toString();
        }
      }

      if(this.current && this.current.Cmusique) {
        let MusiqueInput = <HTMLInputElement>document.getElementById("muse");
        if(MusiqueInput){
          MusiqueInput.value = this.current.Cmusique.toString();
        }
      }
      
    
     
    });
    flatpickr("#datetimepicker-dashboard", {
      inline: true,
      prevArrow: "<span title='Mois précédent'>&laquo;</span>",
      nextArrow: "<span title='Mois suivant'>&raquo;</span>",
      defaultDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    });
  }
  updateThermostat() {
    let thermoInput = <HTMLInputElement>document.getElementById("thermo");
    if(thermoInput){
      let thermoValue = parseFloat(thermoInput.value);
      this.currentRef.update({TempThermostat: thermoValue});

    }
}
updateMusique()
{
  let MusiqueInput = <HTMLInputElement>document.getElementById("muse");
  if(MusiqueInput){
    let museValue = parseFloat(MusiqueInput.value);
    this.currentRef.update({Cmusique: museValue});

  }
}
createLineChart() {
  if(this.history) {

    if(!this.chart_t) {

      // Récupérer les données de température de l'historique
      
  let temperatureData = this.history.map(data => data.temperature);
  

  // Récupérer les données d'humidité de l'historique
  let humidityData = this.history.map(data => data.humidity);

  // Récupérer les heures de l'historique
  let labels = this.history.map(data => data.time);

      this.chart_t = new Chart(this.renderer.selectRootElement('#chartjs-dashboard-line'), {
      type: 'line',
      data: {
          labels: labels,
          datasets: [
          {
              label: "temperature",
              data:[0],
              backgroundColor: 'red'
          },
          
          ]
      },
      options: {
        
      }
  });
}
  }


  

} 
}

  

  