import { Component, OnInit } from '@angular/core';
import { WeatherService } from './services/weather.service';
import { WeatherDisplay } from './models/WeatherDisplay';
import axios from 'axios';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  lat: string = '';
  long: string = '';
  weatherDisplay: WeatherDisplay = new WeatherDisplay();

  constructor(public weatherService: WeatherService) {}

  ngOnInit(): void {
    try {
      navigator.geolocation.getCurrentPosition((position) => {
        this.savePosition(position);
      });
    } catch (error) {
      alert('Browser does not support location services');
    }
  }

  async savePosition(position: any) {
    try {
      this.lat = position.coords.latitude.toFixed(4).toString();
      this.long = position.coords.longitude.toFixed(4).toString();

      const weatherResponse = await axios.get(
        `${environment.weatherAzure}?lat=${this.lat}&long=${this.long}&output=show`
      );
      this.weatherDisplay = weatherResponse.data;
    } catch (error: any) {
      alert(error);
    }
  }

  saveFile() {
    try {
      const url = `${environment.weatherAzure}?lat=${this.lat}&long=${this.long}&output=file`;
      window.open(url, '_blank');
    } catch (error: any) {
      alert(error);
    }
  }
}
