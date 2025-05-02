import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Races } from '../Model/Races';
import { Comment } from '../Model/Comment';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Races[]>('http://localhost:3000/app/all_races', {withCredentials: true});
  }

  getTopic(racesId: string) {
    return this.http.get<Races>(`http://localhost:3000/app/races/${racesId}`, {withCredentials: true});
  }

  // getUserTopics() {
  //   return this.http.get<Races[]>('http://localhost:3000/app/my_races', {withCredentials: true});
  // }

  newTopic(title: string) {
    const body = new URLSearchParams();
    body.set('title', title);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<Races>('http://localhost:3000/app/new_races', body, {headers: headers, withCredentials: true});
  }

  deleteTopic(racesId: string) {
    return this.http.delete(`http://localhost:3000/app/delete_races/${racesId}`, {withCredentials: true, responseType: 'text'});
  }

  editTopic(racesId: string, title: string) {
    const body = new URLSearchParams();
    body.set('title', title);

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

  likeTopic(racesId: string) {
    return this.http.put<Races>(`http://localhost:3000/app/like_races/${racesId}`, {}, {withCredentials: true});
  }

  dislikeTopic(racesId: string) {
    return this.http.put<Races>(`http://localhost:3000/app/dislike_races/${racesId}`, {}, {withCredentials: true});
  }
}
