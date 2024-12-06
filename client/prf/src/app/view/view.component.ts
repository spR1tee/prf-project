import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ContentService } from '../shared/services/content.service';
import { AuthService } from '../shared/services/auth.service';
import { FormsModule } from '@angular/forms'
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [MatToolbarModule,
    MatListModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule, 
    FormsModule,
    MatCardModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent implements OnInit{
  owned_contents!: any;
  user?: any;
  current_logged_in!: any;
  
  displayedColumns: string[] = ['title', 'content', 'editors', 'viewers'];

  constructor(private formBuilder: FormBuilder, private location: Location, private router: Router, private contentService: ContentService, private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUser().subscribe(
      data => {
        this.current_logged_in = data;
        console.log("getUser:")
        console.log(data);
        console.log(this.current_logged_in[0]);
        this.show_data();
      }
    );
  }

  show_data() {
    this.authService.getUserById(this.current_logged_in[0]._id.toString()).subscribe(
      data => {
        console.log("getuserbyid:");
        this.user = data;
        this.contentService.getViewContent(this.user.email.toString()).subscribe({
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

