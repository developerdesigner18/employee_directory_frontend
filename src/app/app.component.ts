import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';

interface Employee {
  id: number;
  name: string;
  email: string;
  job_title: string;
  department: string;
  start_date: string;
  end_date: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'employee_frontend';
  searchValue = new FormControl('');
  total = 1;
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  date = null;
  listOfColumn = [
    {
      name: 'name',
      title: 'Name',
      compare: (a: Employee, b: Employee) => a.name.localeCompare(b.name),
    },
    {
      name: 'email',
      title: 'Email',
      compare: (a: Employee, b: Employee) => a.email.localeCompare(b.email),
    },
    {
      name: 'job_title',
      title: 'Job Title',
      compare: (a: Employee, b: Employee) =>
        a.job_title.localeCompare(b.job_title),
    },
    {
      name: 'department',
      title: 'Department',
      compare: (a: Employee, b: Employee) =>
        a.department.localeCompare(b.department),
    },
    {
      name: 'start_date',
      title: 'Start Date',
      compare: (a: Employee, b: Employee) =>
        Number(new Date(a.start_date)) - Number(new Date(b.start_date)),
    },
    {
      name: 'end_date',
      title: 'End Date',
      compare: (a: Employee, b: Employee) =>
        Number(new Date(a.end_date)) - Number(new Date(b.end_date)),
    },
  ];
  listOfData: Employee[] = [];

  listOfDisplayData: Employee[] = [];

  constructor(private service: ApiService) {}

  ngOnInit(): void {
    this.loadDataFromServer(
      this.pageIndex,
      this.pageSize,
      null,
      null,
      [],
      this.searchValue.value,
      null
    );
  }

  onChange(result: Date[]): void {
    console.log('onChange: ', result);
  }

  reset(): void {
    this.searchValue.reset();
    this.date = null;
    this.search();
  }

  search(): void {
    this.loadDataFromServer(
      this.pageIndex,
      this.pageSize,
      null,
      null,
      [],
      this.searchValue.value,
      this.date
    );
  }

  generatePdf() {
    this.service.generatePdf(this.listOfData).subscribe((res) => {
      window.open(`${environment.backend_url}/${res.link}`, '_blank');
    });
  }

  generateCsv() {
    this.service.generateCsv(this.listOfData).subscribe((res) => {
      window.open(`${environment.backend_url}/${res.link}`, '_blank');
    });
  }

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filter: Array<{ key: string; value: string[] }>,
    query: string | null,
    date: [] | null
  ): void {
    this.loading = true;
    this.service
      .getEmployees(
        pageIndex,
        pageSize,
        sortField,
        sortOrder,
        filter,
        query,
        date
      )
      .subscribe((data) => {
        this.loading = false;
        this.total = data.totalLength; // mock the total data here
        this.listOfData = data.items;
        this.listOfDisplayData = [...this.listOfData];
      });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.loadDataFromServer(
      pageIndex,
      pageSize,
      sortField,
      sortOrder,
      filter,
      this.searchValue.value,
      null
    );
  }
}
