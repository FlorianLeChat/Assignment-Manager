import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

import { Course } from "../../models/course.model";
import { Assignment } from "../../models/assignment.model";
import { CoursesService } from "../../shared/courses.service";
import { AssignmentsService } from "../../shared/assignments.service";

@Component( {
	selector: "app-add-assignment",
	templateUrl: "./add-assignment.component.html",
	styleUrls: [ "./add-assignment.component.css" ]
} )

export class AddAssignmentComponent implements OnInit
{
	// Propriétés du composant.
	teacher: string = "Inconnu";
	image!: string;
	courses: Course[] = [];

	// Propriétés pour le formulaire.
	firstFormGroup: any;
	secondFormGroup: any;
	thirdFormGroup: any;
	isLinear = true;

	// Constructeur.
	constructor(
		private _formBuilder: FormBuilder,
		private router: Router,
		private assignmentsService: AssignmentsService,
		private coursesService: CoursesService
	)
	{
		this.firstFormGroup = this._formBuilder.group( {
			firstCtrl: [ "", Validators.required ], // Nom du devoir.
		} );

		this.secondFormGroup = this._formBuilder.group( {
			secondCtrl: [ "", Validators.required ], // Matière du devoir.
		} );

		this.thirdFormGroup = this._formBuilder.group( {
			thirdCtrl: [ "", Validators.required ], // Date de rendu.
		} );
	}

	// Méthode d'initialisation.
	ngOnInit()
	{
		// Récupération de toutes les matières (avec pagination).
		this.coursesService.getCourses( 1, 10 )
			.subscribe( data =>
			{
				this.courses = data.docs;
			} );
	}

	// Méthode pour récupérer les informations d'une matière.
	onChange( id: number )
	{
		this.coursesService.getCourse( id )
			.subscribe( data =>
			{
				this.teacher = data.teacherName;
				this.image = data.image;
			} );
	}

	// Méthode pour ajouter un devoir.
	onSubmit()
	{
		if ( !this.firstFormGroup.value.firstCtrl || !this.secondFormGroup.value.secondCtrl || !this.thirdFormGroup.value.thirdCtrl )
		{
			return;
		}

		const newAssignment = new Assignment();
		newAssignment.id = Math.floor( Math.random() * 10000 );
		newAssignment.nom = this.firstFormGroup.value.firstCtrl;
		newAssignment.course = +this.secondFormGroup.value.secondCtrl;
		newAssignment.dateDeRendu = new Date( this.thirdFormGroup.value.thirdCtrl );
		newAssignment.rendu = false;

		this.assignmentsService.addAssignment( newAssignment ).subscribe( () => { } );

		// Redirection vers la page d'accueil.
		this.router.navigateByUrl( "/", { skipLocationChange: true } ).then( () =>
			this.router.navigate( [ "/home" ] )
		);
	}
}