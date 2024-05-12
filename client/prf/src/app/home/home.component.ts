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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatToolbarModule,
            MatListModule,
            MatButtonModule,
            ReactiveFormsModule,
            CommonModule, 
            FormsModule,
            MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit{
  owned_contents!: Content[];
  sorted_contents?: Content[];
  stringSubscription!: Subscription | undefined;
  
  contentForm!: FormGroup;
  current_user = "";
  displayedColumns: string[] = ['title', 'content', 'editors', 'viewers'];

  constructor(private formBuilder: FormBuilder, private location: Location, private router: Router, private contentService: ContentService, private authService: AuthService) { }

  ngOnInit() {
    this.stringSubscription = this.authService.getString().subscribe(
      string => {
        if (string !== "") {
          this.current_user = string;
        }
      }
    );

  this.stringSubscription.unsubscribe();
      console.log(this.authService.email_string);
      this.contentForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      content: [''],
      editors: ['', [Validators.email]],
      viewers: ['', [Validators.email]],
    })

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
      if (contents[i].owner === this.authService.email_string) {
        this.sorted_contents?.push(contents[i]);
      }
    }
  }

  onSubmit() {
    if (this.contentForm.valid) {
      console.log('Form data:', this.contentForm.value);
      this.contentService.create(this.contentForm.value).subscribe({
        next: (data) => {
          console.log(data);
          location.reload();
        }, error: (err) => {
          console.log(err);
        }
      });
    } else {
      console.log('Form is not valid.');
    }
  }

 deleteItem(item: any) {
    this.contentService.delete(item.title).subscribe({
    next: (data) => {
      console.log(data);
      location.reload();
    }, error: (err) => {
      console.log(err);
    }
  })
 }

editItem(item: any) {

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

}
