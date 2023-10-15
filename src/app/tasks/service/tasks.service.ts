import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(
    private http: HttpClient) { }
  private apiUrl = 'https://manishbaghel001.github.io/tasks/src/assets/data.json';

  updateJsonFile(updatedData: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const requestData = {
      message: 'Updated data.json', // Commit message
      content: btoa(JSON.stringify(updatedData)), // Base64 encode your updated JSON
      sha: 'sha-of-existing-file', // You need to get the SHA of the existing file to update it
    };

    // Make the POST request to update the JSON file
    return this.http.put(this.apiUrl, requestData, { headers });
  }
  getJson() {
    return this.http.get("assets/data.json")
  }
  postJson() {
    return this.http.get("assets/updatedFile.json")
  }
}
