import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ContentService } from '../shared/services/content.service';
import { AuthService } from '../shared/services/auth.service';
import { FormsModule } from '@angular/forms'
import { MatCardModule } from '@angular/material/card';

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

export class HomeComponent implements OnInit {
  owned_contents!: any;
  user?: any;
  current_logged_in!: any;

  contentForm!: FormGroup;
  displayedColumns: string[] = ['title', 'content', 'editors', 'viewers'];

  constructor(private formBuilder: FormBuilder, private location: Location, private router: Router, private contentService: ContentService, private authService: AuthService) { }

  ngOnInit() {
      this.contentForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      editors: [''],
      viewers: ['']
    })

    this.authService.getUser().subscribe(
      data => {
        this.current_logged_in = data;
        console.log("getUser:")
        console.log(data);
        console.log(this.current_logged_in[0]._id);
        this.show_data();
      }
    );
  }

  show_data() {
    this.owned_contents = null;
    this.authService.getUserById(this.current_logged_in[0]._id.toString()).subscribe(
      data => {
        console.log("getusercontentbyid:");
        this.user = data;
        this.contentService.getOwnedContent(this.user.email.toString()).subscribe({
          next: (data) => {
            this.owned_contents = data;
            console.log(data);
          }, error: (err) => {
            console.log(err);
          }
        });
      }
    );
  }

  onSubmit() {
    if (this.contentForm.valid) {
      console.log('Form data:', this.contentForm.value);
      this.contentService.create(this.contentForm.value, this.user.email).subscribe({
        next: (data) => {
          console.log(data);
          location.reload();
          this.router.navigateByUrl('/home');
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
        this.router.navigateByUrl('/home');
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  editItem(item: any) {
      this.contentService.changeData(item);
      this.router.navigateByUrl('/edit_content');
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
