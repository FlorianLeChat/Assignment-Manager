import { Router } from "@angular/router";
import { Component, Input, OnInit } from "@angular/core";

import { Course } from "../../models/course.model";
import { Assignment } from "../../models/assignment.model";
import { AuthService } from "../../shared/auth.service";
import { CoursesService } from "../../shared/courses.service";
import { AssignmentsService } from "../../shared/assignments.service";

@Component( {
	selector: "app-assignment-detail",
	templateUrl: "./assignment-detail.component.html",
	styleUrls: [ "./assignment-detail.component.css" ]
} )

export class AssignmentDetailComponent implements OnInit
{
	// Devoir actuellement sélectionné.
	@Input() assignmentTransmis?: Assignment;

	// État de connexion.
	isLogged = false;
	isAdmin = false;

	// Propriétés du composant.
	courseName = "";
	teacherName = "";
	teacherAvatar = "";

	// Constructeur.
	constructor(
		private assignmentsService: AssignmentsService,
		private coursesService: CoursesService,
		private authService: AuthService,
		private router: Router
	)
	{
		this.isLogged = this.authService.isLogged;
		this.isAdmin = this.authService.isAdmin;
	}

	// Méthode d'initialisation.
	ngOnInit(): void
	{
		// Si l'utilisateur n'est pas connecté ou qu'il n'y a pas de devoir sélectionné, on ne fait rien.
		if ( !this.assignmentTransmis ) return;

		// On récupère les informations à propos de la matière et du professeur.
		this.coursesService.getCourses( 1, 10 )
			.subscribe( data =>
			{
				// Filtrage des résultats avec le nom de la matière.
				data.docs = data.docs.filter( ( course: Course ) => course.id === this.assignmentTransmis?.course )[ 0 ];

				// Définition des propriétés du composant.
				this.courseName = data.docs.nom;
				this.teacherName = data.docs.teacherName;
				this.teacherAvatar = data.docs.teacherAvatar;
			} );
	}

	// Méthode pour rendre un devoir.
	onAssignmentRendu()
	{
		// Si l'utilisateur n'est pas connecté ou qu'il n'y a pas de devoir sélectionné, on ne fait rien.
		if ( !this.assignmentTransmis || !this.assignmentTransmis.note || !this.authService.isLogged ) return;

		// On met à jour le devoir pour le rendre.
		this.assignmentTransmis.rendu = true;

		// On met à jour le devoir dans la base de données.
		this.assignmentsService.updateAssignment( this.assignmentTransmis )
			.subscribe( () =>
			{
				this.router.navigate( [ "/home" ] );
			} );
	}

	// Méthode pour supprimer un devoir.
	onDelete()
	{
		// Si l'utilisateur n'est pas connecté ou qu'il n'y a pas de devoir sélectionné, on ne fait rien.
		if ( !this.assignmentTransmis || !this.authService.isAdmin ) return;

		// On supprime le devoir dans la base de données.
		this.assignmentsService.deleteAssignment( this.assignmentTransmis )
			.subscribe( () =>
			{
				this.router.navigateByUrl( "/", { skipLocationChange: true } ).then( () =>
					this.router.navigate( [ "/home" ] )
				);
			} );

		// On supprime le devoir actuellement sélectionné.
		this.assignmentTransmis = undefined;
	}

	// Méthode pour éditer un devoir.
	onClickEdit()
	{
		// Si l'utilisateur n'est pas connecté ou qu'il n'y a pas de devoir sélectionné, on ne fait rien.
		if ( !this.assignmentTransmis || !this.authService.isAdmin ) return;

		// On redirige vers la page d'édition du devoir.
		this.router.navigate( [ "/assignment", this.assignmentTransmis.id, "edit" ], {
			queryParams: {
				nom: this.assignmentTransmis.nom
			}, fragment: "edition"
		} );
	}
}