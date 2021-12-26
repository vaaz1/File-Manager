import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FileServiceService } from './file-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public formGroup1 = this.fb.group({
    name: [null, Validators.required],
    file: [null, Validators.required]
  });

  fileList: string[] = [];
  isDropdownOpen = false;
  counter = 0;
  fileType: string = '';
  fileName: string = 'Upload File';

  constructor(private fileService: FileServiceService, private fb: FormBuilder) {

  }

  ngOnInit() {
    this.fileService.getAllFiles().then((files:any) => {
      this.fileList = [...files];
      console.log(this.fileList);
      this.counter = this.fileList.length;
    });

  }


  onFileChange(event:any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.fileName = event.target.files[0].name;
      let fName = event.target.files[0].name.split('.');
      this.fileType = '.'+fName[1];

      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.formGroup1.patchValue({
          file: reader.result
        });
      };
    }
  }

  onSubmit() {
    console.log('file ', this.formGroup1.get('file')?.value);
    let name = this.formGroup1.get('name')?.value + this.fileType;
    console.log('file name ', name);
    this.fileService.saveFile(name, this.formGroup1.get('file')?.value).then((response: any) => {
        console.log('response received: ', response);
        this.fileList.push(response.file);
        this.counter = this.fileList.length;
        this.fileName = 'Upload File';
        this.formGroup1.reset();
        alert("The file was uploaded successfully!");
      }).catch(err => {
        console.log('err ', err);
        alert( "Upload failed!" );
      });
  }

  downloadFile(fileName: string) {
    this.fileService.downloadFile(fileName);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
