import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Student } from './model/student.model';
import { StudentService } from './service/student.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form!: FormGroup;
  editForm!: FormGroup;
  students: Student[] = [];
  divisions = [];
  districts = [];
  student: Student;
  selectedDistrict;
  submitted = false;
  subDistricts: any[];
  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }
  ngOnInit() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      university: ['', Validators.required],
      divisionName: ['', Validators.required],
      districtName: ['', Validators.required]
      
    });
    this.editForm = this.fb.group({
      id: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      university: ['', Validators.required]
    });
    this.getStudent();
    this.getDivisions();
    this.getDistricts();
  }
  
  getDivisions() {
    this.studentService.getDivisions().subscribe(data => {
      this.divisions = data;
      this.divisions.sort((a, b) => {
        let fa = a.divisionName.toLowerCase(),
            fb = b.divisionName.toLowerCase();
    
        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    });
        
    })
  }
  getDistricts() {
    this.studentService.getDistricts().subscribe(data => {
      this.districts = data;
    })
  }

  get f() { return this.form.controls; }
  get g() { return this.editForm.controls; }


  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) { return }
    const student = { ...this.form.value };
    debugger
    this.studentService.saveStudent(student).subscribe(data => {
      this.students.push(data);
      // this.getStudent();
      this.toastr.success('Data saved successfully', '', {
        positionClass: 'toast-bottom-right',
      });
      this.form.reset();
      this.submitted = false;
    })
  }

  getStudent() {
    this.studentService.getStudent().subscribe(data => {
      this.students = data;
      debugger
    })
  }

  editStudent(template, student: Student) {
    this.student = student
    debugger
    const obj = Object.assign({}, this.editForm?.getRawValue(), student);
    this.editForm?.patchValue(obj);
    this.modalService.open(template, {
      backdrop: 'static',
      keyboard: false,
    });
    // modalRef.componentInstance.student = student;
  }
  onEditModalSubmit() {
    const student = { ...this.editForm.value };
    this.studentService.editStudent(student).subscribe(data => {
      console.log(data);
      // this.getStudent();
      debugger
      let updatedStudent = this.students.find(std => std.id == data.id);
      let index = this.students.indexOf(updatedStudent);
      if(index > -1) {
        this.students[index] = updatedStudent;
      }
      this.toastr.success('Data updated successfully', '', {
        positionClass: 'toast-bottom-right',
      });
      this.student = null;
      this.modalService.dismissAll();
    }
    )
  }
  onEditClose() {
    this.modalService.dismissAll();
    this.student = null;
  }

  deleteStudent(student: Student) {
    Swal.fire({
      title: 'Are you sure you want to delete?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.studentService.deleteStudent(student).subscribe(data => {
          // this.students = data;
          this.getStudent();
        })
        Swal.fire('Deleted!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })

  }

  viewStudent(template, student) {
    this.student = student;
    this.modalService.open(template, {
      backdrop: 'static',
      keyboard: false,
    });
  }

  filterDistrictById() {
    const selectedDivision = this.f['divisionName'].value;
    // if(selectedDivision) {
    //   this.subDistricts = this.districts.filter(district => district.districtId == selectedDivision.districtId);
    // }
    debugger
    return this.districts.filter(district => district.districtId == selectedDivision);
  }
}
