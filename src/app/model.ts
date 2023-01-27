import { Time } from "@angular/common";

export interface ESP32_Data{

  Cmusique?: number;
  TempThermostat?: number;
  time?: string;
  temperature?: number;
  humidity?: number;
  defaut?:number;
  porte?:boolean;
  
  }