import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Student } from '../model/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }
  private getServerUrl(){
    return environment.production? '' :environment.baseUrl;
}

  saveStudent(student: Student) {
    return this.http.post<Student>(`${this.getServerUrl()}/api/Student`,student);
  }

  getStudent() {
    return this.http.get<Student[]>(`${this.getServerUrl()}/api/Student`)
  }

  editStudent(student) {
    debugger
    return this.http.put<Student>(`${this.getServerUrl()}/api/Student/${student.id}`, student)
  }

  deleteStudent(student) {
    return this.http.delete<Student>(`${this.getServerUrl()}/api/Student/${student.id}`)
  }

  getDivisions() {
    return this.http.get<any>(`${this.getServerUrl()}/api/Division`)
  }
  getDistricts() {
    return this.http.get<any>(`${this.getServerUrl()}/api/District`)
  }

  getTown() {
    return this.http.get<any>(`${this.getServerUrl()}/api/Town`)
  }
}
