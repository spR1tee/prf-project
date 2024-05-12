import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ContentService } from '../shared/services/content.service';
import { AuthService } from '../shared/services/auth.service';
import { Content } from '../shared/model/content';
import { FormsModule } from '@angular/forms'
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [MatToolbarModule,
    MatListModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule, 
    FormsModule,
    MatCardModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  owned_contents!: Content[];
  sorted_contents?: Content[];
  
  current_user = "";
  displayedColumns: string[] = ['title', 'content', 'editors', 'viewers'];

  constructor(private formBuilder: FormBuilder, private location: Location, private router: Router, private contentService: ContentService, private authService: AuthService) { }

  ngOnInit() {
    this.authService.getString().subscribe(
      string => {
        if (string !== "") {
          this.current_user = string;
        }
      }
    );
    console.log(this.current_user);

    this.contentService.getAll().subscribe({
      next: (data) => {
        this.owned_contents = data;
        this.sort_data(this.owned_contents);
        console.log(data);
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  sort_data(contents: Content[]) {
    for(let i = 0; i < contents.length; i++) {
      if (contents[i].editors.includes(this.current_user)) {
        this.sorted_contents?.push(contents[i]);
      }
    }
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }
  
    logout() {
      this.authService.logout().subscribe({
        next: (data) => {
          console.log(data);
          this.router.navigateByUrl('/login');
        }, error: (err) => {
          console.log(err);
        }
      });
    }
  
    goBack() {
      this.location.back();
    }

    editItem(item: any) {

    }

}
