import { Component, OnInit } from '@angular/core';
import { ContentService } from '../shared/services/content.service';
import { FormsModule } from '@angular/forms'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-edit-content',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './edit-content.component.html',
  styleUrl: './edit-content.component.scss'
})
export class EditContentComponent implements OnInit{
  data: any;
  contentForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private location: Location, private router: Router, private contentService: ContentService) {}

  ngOnInit() {
    this.contentService.currentData.subscribe(data => {
      if (data) {
        this.data = data;
        this.contentForm = this.formBuilder.group({
          title: ['', [Validators.required]],
          content: ['', [Validators.required]],
          editors: [''],
          viewers: ['']
        })

        this.contentForm.setValue({
          title: data.title,
          content: data.content,
          editors: data.editors,
          viewers: data.viewers
        });
      }
    });
  }

  onSubmit() {
    if (this.contentForm.valid) {
      console.log('Form data:', this.contentForm.value);
      this.contentService.update(this.contentForm.value, this.data.owner, this.data._id).subscribe({
        next: (data) => {
          console.log(data);
          this.router.navigateByUrl('/home');
        }, error: (err) => {
          console.log(err);
        }
      });
    } else {
      console.log('Form is not valid.');
    }
  }

  goBack() {
    this.location.back();
  }
}
