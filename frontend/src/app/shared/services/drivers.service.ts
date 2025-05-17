import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drivers } from '../Model/Drivers';
import { Observable } from 'rxjs';

export interface DriverStat{
  key: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})

export class DriversService {

  constructor(private http: HttpClient) { }

  getAllDrivers(q: string = ''): Observable<Drivers[]> {
          let params = new HttpParams();
      if (q.trim()) {
        params = params.set('q', q.trim());
      }
          return this.http.get<Drivers[]>('http://localhost:3000/app/all_drivers', { params });
        }
  
    getDriver(driversId: string) {
      return this.http.get<Drivers>(`http://localhost:3000/app/drivers/${driversId}`, {withCredentials: true});
    }

    newDriver(driverName: string, wikipediaUrl: string) {
        const body = new URLSearchParams();
        body.set('driverName', driverName);
        body.set('wikipediaUrl', wikipediaUrl);
    
        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded'
        });
    
        return this.http.post<Drivers>('http://localhost:3000/app/new_drivers', body, {headers: headers, withCredentials: true});
      }
    
      deleteDriver(driversId: string) {
        return this.http.delete(`http://localhost:3000/app/delete_driver/${driversId}`, {withCredentials: true, responseType: 'text'});
      }
    
      editDriver(driversId: string, driverName: string, wikipediaUrl: string) {
        const body = new URLSearchParams();
        body.set('driverName', driverName);
        body.set('wikipediaUrl', wikipediaUrl);
    
        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded'
        });
    
        return this.http.put(`http://localhost:3000/app/edit_drivers/${driversId}`, body, {headers: headers, withCredentials: true, responseType: 'text'});
      }

      likeDriver(driversId: string) {
          return this.http.put<Drivers>(`http://localhost:3000/app/like_drivers/${driversId}`, {}, {withCredentials: true});
        }
      
        dislikeDriver(driversId: string) {
          return this.http.put<Drivers>(`http://localhost:3000/app/dislike_drivers/${driversId}`, {}, {withCredentials: true});
        }

          getDriverStat(driversId: string, wikiUrl: string): Observable<DriverStat[]>{
              return this.http.get<DriverStat[]>(`http://localhost:3000/app/driver_stat/${driversId}`, { params: { wikiUrl } });
            }

            updateWikipediaLink(driversId: string, wikiUrl: string) {
                  return this.http.put<Drivers>(`http://localhost:3000/app/driver_update/${driversId}`, {}, { params: { wikiUrl }, withCredentials: true });
                }

}
