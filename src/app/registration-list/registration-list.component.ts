import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { User } from '../models/user.model';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NgConfirmService } from 'ng-confirm-box';

@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss']
})
export class RegistrationListComponent implements OnInit {
  public dataSource!: MatTableDataSource<User>;
  public users!: User[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'mobile', 'bmiResult', 'gender', 'package', 'enquiryDate', 'action'];

  constructor(
    private api: ApiService,
    private router: Router,
    private toastService: NgToastService,
    private confirmService: NgConfirmService){}
  ngOnInit(): void {
    this.getUsers();
  }
  getUsers(){
    this.api.getRegisteredUser().subscribe(res => {
      this.users = res;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(id:number){
    this.router.navigate(['update', id]);
  }

  delete(id:number){
    this.confirmService.showConfirm("Are you sure you want to delete?",
    () => {
      this.api.deleteRegistered(id).subscribe(res => {
        if(res){
          this.toastService.success({detail: "Success", summary: "Enquiry Deleted", duration: 3000});
          this.getUsers();
        }
      })
    },
    () => {

    })

  }
}
