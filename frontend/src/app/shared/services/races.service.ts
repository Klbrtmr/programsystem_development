import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Races } from '../Model/Races';
import { Comment } from '../Model/Comment';
import { Observable } from 'rxjs';

export interface RaceResult{
  position: string;
  driver: string;
  team: string;
  time: string;
  laps: string;
}

@Injectable({
  providedIn: 'root'
})
export class RacesService {

  constructor(private http: HttpClient) { }
/*
  getAll() {
    return this.http.get<Races[]>('http://localhost:3000/app/all_races', {withCredentials: true});
  }*/
/*
    getAll(q?: string) {
      let url = 'http://localhost:3000/all_races'
      if (q?.trim()) url += `?q=${encodeURIComponent(q)}`
      return this.http.get<Races[]>(url)
    }*/

      getAll(q: string = ''): Observable<Races[]> {
        let params = new HttpParams();
    if (q.trim()) {
      params = params.set('q', q.trim());
    }
        return this.http.get<Races[]>('http://localhost:3000/app/all_races', { params });
      }

  getRace(racesId: string) {
    return this.http.get<Races>(`http://localhost:3000/app/races/${racesId}`, {withCredentials: true});
  }

  // getUserTopics() {
  //   return this.http.get<Races[]>('http://localhost:3000/app/my_races', {withCredentials: true});
  // }

  newRace(trackName: string, locationName: string, date: string) {
    const body = new URLSearchParams();
    body.set('trackName', trackName);
    body.set('locationName', locationName);
    body.set('date', date);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<Races>('http://localhost:3000/app/new_races', body, {headers: headers, withCredentials: true});
  }

  deleteRace(racesId: string) {
    return this.http.delete(`http://localhost:3000/app/delete_race/${racesId}`, {withCredentials: true, responseType: 'text'});
  }

  editRace(racesId: string, trackName: string, locationName: string) {
    const body = new URLSearchParams();
    body.set('trackName', trackName);
    body.set('locationName', locationName);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.put(`http://localhost:3000/app/edit_races/${racesId}`, body, {headers: headers, withCredentials: true, responseType: 'text'});
  }

  addComment(racesId: string, comment: string) {
    const body = new URLSearchParams();
    body.set('comment', comment);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<Comment>(`http://localhost:3000/app/new_comment/${racesId}`, body, {headers: headers, withCredentials: true});
  }

  editComment(racesId: string, commentId: string, comment: string) {
    const body = new URLSearchParams();
    body.set('comment', comment);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.put(`http://localhost:3000/app/edit_comment/${racesId}/${commentId}`, body, {headers: headers, withCredentials: true, responseType: 'text'});
  }

  deleteComment(racesId: string, commentId: string) {
    return this.http.delete(`http://localhost:3000/app/delete_comment/${racesId}/${commentId}`, {withCredentials: true, responseType: 'text'});
  }

  likeComment(racesId: string, commentId: string) {
    return this.http.put<Races>(`http://localhost:3000/app/like_comment/${racesId}/${commentId}`, {}, {withCredentials: true});
  }

  dislikeComment(racesId: string, commentId: string) {
    return this.http.put<Races>(`http://localhost:3000/app/dislike_comment/${racesId}/${commentId}`, {}, {withCredentials: true});
  }

  likeRace(racesId: string) {
    return this.http.put<Races>(`http://localhost:3000/app/like_races/${racesId}`, {}, {withCredentials: true});
  }

  dislikeRace(racesId: string) {
    return this.http.put<Races>(`http://localhost:3000/app/dislike_races/${racesId}`, {}, {withCredentials: true});
  }

  getRaceResults(raceId: string, wikiUrl: string): Observable<RaceResult[]>{
    return this.http.get<RaceResult[]>(`http://localhost:3000/app/results/${raceId}`, { params: { wikiUrl } });
  }

/*
  updateWikipediaLink(raceId: string, wikiUrl: string) {
    return this.http.put<Races>(`http://localhost:3000/app/race_update/${raceId}`, { params: { wikiUrl }});
  }*/

    updateWikipediaLink(raceId: string, wikiUrl: string) {
      return this.http.put<Races>(`http://localhost:3000/app/race_update/${raceId}`, {}, { params: { wikiUrl }, withCredentials: true });
    }

}
