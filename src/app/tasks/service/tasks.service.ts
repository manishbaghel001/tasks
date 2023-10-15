import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(
    private http: HttpClient) { }
  private apiUrl = 'https://manishbaghel001.github.io/tasks/docs/assets/data.json';

  updateJsonFile(updatedData: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const requestData = {
      message: 'Updated data.json', // Commit message
      content: btoa(JSON.stringify(updatedData)), // Base64 encode your updated JSON
      sha: 'https://github.com/manishbaghel001/tasks/blob/8886e57d1bd2b847fe9283920e22740e8000705f/docs/assets/data.json', // You need to get the SHA of the existing file to update it
    };

    // Make the POST request to update the JSON file
    return this.http.post(this.apiUrl, requestData, { headers });
  }
  getJson() {
    return this.http.get("https://manishbaghel001.github.io/tasks/docs/assets/data.json")
  }
  postJson() {
    return this.http.get("https://manishbaghel001.github.io/tasks/docs/assets/updatedFile.json")
  }
}
