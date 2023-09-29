import { Component, OnInit } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { first } from 'rxjs/operators';

import { CategoryService } from '@app/_services';
import { Status } from '@app/_helpers/enums/status';
import { AlertService } from '@app/_components/alert/alert.service';


@Component({ 
    templateUrl: 'add-edit.component.html',
    styleUrls: ['categorys.component.css'],
    standalone: true,
    imports: [
        NgIf, ReactiveFormsModule, NgClass, RouterLink,
        MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
        MatSelectModule
    ]
})
export class AddEditComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private categoryService: CategoryService,
        private alertService: AlertService
    ) { }
    
    options = {
        autoClose: true,
        keepAfterRouteChange: true
    };

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        // form with validation rules
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            code: ['', Validators.required],
            description: [''],
            status: [Status.ENABLED, Validators.required]
        });

        this.title = 'Add Category';
        if (this.id) {
            // edit mode
            this.title = 'Edit Category';
            this.loading = true;
            this.categoryService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                    this.loading = false;
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        
        this.submitting = true;
        this.saveCategory()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Category saved', this.options);
                    this.router.navigateByUrl('/categorys');
                },
                error: (error: string) => {
                    this.alertService.error(error), this.options;                    
                    this.submitting = false;
                }
            })
    }

    private saveCategory() {
        // create or update category based on id param
        return this.id
            ? this.categoryService.update(this.id!, this.form.value)
            : this.categoryService.create(this.form.value);
    }
}