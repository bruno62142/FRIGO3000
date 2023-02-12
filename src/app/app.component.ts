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
  private historyTime: AngularFireList<ESP32_Data>;
  private historyTemperature: AngularFireList<ESP32_Data>;
  private historyHumidity: AngularFireList<ESP32_Data>;
  private historyDefPorte: AngularFireList<ESP32_Data>;
  private historyDefTemperature: AngularFireList<ESP32_Data>;
  private historyDefHumidity: AngularFireList<ESP32_Data>;
 
  private currentRef: AngularFireObject<ESP32_Data>;
  //private history_DefRef: AngularFireList<ESP32_Data>;

  public history_time?: ESP32_Data[];
  public history_temperature?: ESP32_Data[];
  public history_humidity?: ESP32_Data[];

  public history_def_porte?: ESP32_Data[];
  public history_def_temperature?: ESP32_Data[];
  public history_def_humidity?: ESP32_Data[];


  public current?: ESP32_Data|null;
  public chart_t?: any;
  public chart_h?:any;


  constructor(db: AngularFireDatabase,private renderer: Renderer2){
    this.historyTime= db.list<ESP32_Data>('/history_time');
    this.historyTemperature= db.list<ESP32_Data>('/history_temperature');
    this.historyHumidity= db.list<ESP32_Data>('/history_humidity');

    this.historyDefPorte= db.list<ESP32_Data>('/historydef_porte');
    this.historyDefTemperature= db.list<ESP32_Data>('/historydef_temperature');
    this.historyDefHumidity= db.list<ESP32_Data>('/historydef_humidity');

    this.currentRef= db.object<ESP32_Data>('/current');
 

  }


  ngOnInit(): void{
   
    /*this.history_DefRef
    .snapshotChanges()
    .pipe(map((changes) => changes.map((c) => ({ ...c.payload.val()}))))
    .subscribe((data) => {
      this.history_def=data; 
  
    });*/
    this.historyTime.valueChanges().subscribe((data) =>{
      this.history_time=data; 
      //console.log(this.history_time);
      //this.createLineChart();
    });

    this.historyTemperature.valueChanges().subscribe((data) =>{
      this.history_temperature=data; 
      //console.log(this.history_temperature);
      this.createLineChart();
    });

    this.historyHumidity.valueChanges().subscribe((data) => 
  {
      this.history_humidity=data; 
     // console.log(this.history_humidity);
      console.log(this.history_humidity);
      this.createbarChart();
    });

    this.historyDefPorte.valueChanges().subscribe((data) =>{
      this.history_def_porte=data; 
      //console.log(this.history_time);
    
    });

    this.historyDefTemperature.valueChanges().subscribe((data) =>{
      this.history_def_temperature=data; 
      //console.log(this.history_temperature);
 
    });

    this.historyDefHumidity.valueChanges().subscribe((data) => 
  {
      this.history_def_humidity=data; 
     // console.log(this.history_humidity);
    
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

createbarChart() {
  if(this.history_time && this.history_humidity) {

    let humidityData = this.history_humidity.slice(-2880).map(data => data);

    // Récupérer les heures de l'historique
    let labels = this.history_time.slice(-2880).map(data => data);
    
    if(this.chart_h) {
      // Update the chart's data
      this.chart_h.data = {
          labels: labels,
          datasets: [
            {
              label: "humidity",
              data: humidityData,
              backgroundColor: 'blue'
            },
          ]
      };
      this.chart_h.update();
    } 
    
    
    else if(!this.chart_h){
      this.chart_h = new Chart(this.renderer.selectRootElement('#chartjs-dashboard-bar'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: "humidity",
              data: humidityData,
              backgroundColor: 'blue'
            },
          ]
        },
        options: {
        }
      });
      
    }
    

  }
}

createLineChart() {
  if(this.history_temperature && this.history_time ) {

    let temperatureData = this.history_temperature.slice(-2880).map(data => data);

    // Récupérer les heures de l'historique
    let labels = this.history_time.slice(-2880).map(data => data);

    if(this.chart_t) {
      // Update the chart's data
      this.chart_t.data = {
          labels: labels,
          datasets: [
            {
              label: "temperature",
              data: temperatureData,
              backgroundColor: 'red'
            },
          ]
      };
      this.chart_t.update();
    } 
  
    
    else if(!this.chart_t){
      this.chart_t = new Chart(this.renderer.selectRootElement('#chartjs-dashboard-line'), {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: "temperature",
              data: temperatureData,
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

  

  