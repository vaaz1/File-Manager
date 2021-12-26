import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';


@Injectable({
  providedIn: 'root'
})
export class FileServiceService {

  rootPath = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

  public saveFile(fileName: string, file: any) {
    return this.http.post(this.rootPath + 'addNewFile?id=' + fileName, {name: fileName, content: file}).toPromise();

  }

  public getAllFiles() {
    return this.http.get(this.rootPath + 'getAllMyFiles').toPromise();
  }

  public downloadFile(fileName: string) {
    this.http.get(this.rootPath + 'downloadFile?id=' + fileName, { responseType: 'blob'}).subscribe(res => {
      
      let downloadurl = window.URL.createObjectURL(res);
      console.log(downloadurl);
      saveAs(downloadurl, fileName);
    }, err => {
      console.log(err);
      alert('Could not download file!')
    });
  }
}
