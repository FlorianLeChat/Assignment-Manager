import { NgModule } from "@angular/core";

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatStepperModule } from "@angular/material/stepper";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatDividerModule } from "@angular/material/divider";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

import { AuthGuard } from "./shared/auth.guard";
import { AppComponent } from "./app.component";
import { AssignmentsComponent } from "./assignments/assignments.component";
import { AddAssignmentComponent } from "./assignments/add-assignment/add-assignment.component";
import { EditAssignmentComponent } from "./assignments/edit-assignment/edit-assignment.component";
import { AssignmentDetailComponent } from "./assignments/assignment-detail/assignment-detail.component";

const routes: Routes = [
	{ path: "", component: AssignmentsComponent },
	{ path: "home", component: AssignmentsComponent },
	{ path: "add", component: AddAssignmentComponent },
	{ path: "assignment/:id", component: AddAssignmentComponent },
	{ path: "assignment/:id/edit", component: EditAssignmentComponent, canActivate: [ AuthGuard ] },
];

@NgModule( {
	declarations: [
		AppComponent,
		AssignmentsComponent,
		AddAssignmentComponent,
		EditAssignmentComponent,
		AssignmentDetailComponent
	],
	imports: [
		HttpClientModule,

		FormsModule,
		ReactiveFormsModule,

		BrowserModule,
		BrowserAnimationsModule,

		MatIconModule,
		MatSortModule,
		MatListModule,
		MatCardModule,
		MatInputModule,
		MatTableModule,
		MatButtonModule,
		MatSelectModule,
		MatDividerModule,
		MatStepperModule,
		MatToolbarModule,
		MatSidenavModule,
		MatCheckboxModule,
		MatFormFieldModule,
		MatPaginatorModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatSlideToggleModule,

		RouterModule.forRoot( routes ),
	],
	providers: [
		{ provide: MAT_DATE_LOCALE, useValue: "fr-FR" },
	],
	bootstrap: [ AppComponent ]
} )

export class AppModule { }