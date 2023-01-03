import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Course } from "../models/course.model";
import { Assignment } from "../models/assignment.model";
import { CoursesService } from "./courses.service";
import { initialAssignments } from "./data";

@Injectable( {
	providedIn: "root"
} )

export class AssignmentsService
{
	private HttpOptions = {
		headers: new HttpHeaders( {
			"Content-Type": "application/json"
		} )
	};

	assignments: Assignment[] = [];

	constructor( private http: HttpClient, private coursesService: CoursesService ) { }

	url = "http://localhost:8010/api/assignments";

	// Récupération de tous les devoirs.
	getAssignments( page: number, limit: number, name: string, rendu: boolean ): Observable<any>
	{
		return this.http.get<any>( this.url + "?page=" + page + "&limit=" + limit + "&name=" + name + "&rendu=" + rendu );
	}

	// Récupération d'un seul devoir.
	getAssignment( id: number ): Observable<Assignment | undefined>
	{
		return this.http.get<Assignment>( this.url + "/" + id );
	}

	// Ajout d'un devoir.
	addAssignment( assignment: Assignment ): Observable<any>
	{
		return this.http.post<Assignment>( this.url, assignment, this.HttpOptions );
	}

	// Modification d'un devoir.
	updateAssignment( assignment: Assignment ): Observable<any>
	{
		return this.http.put<Assignment>( this.url, assignment );
	}

	// Suppression d'un devoir.
	deleteAssignment( assignment: Assignment ): Observable<any>
	{
		return this.http.delete( this.url + "/" + assignment._id );
	}

	// Peuplement des devoirs.
	peuplerBDAvecForkJoin(): void
	{
		initialAssignments.forEach( ( a ) =>
		{
			this.coursesService.getCourse( a.course ).subscribe( ( course: Course ) =>
			{
				const newAssignment: any = new Assignment();
				newAssignment.id = a.id;
				newAssignment.nom = a.nom;
				newAssignment.auteur = a.auteur;
				newAssignment.course = course.id;
				newAssignment.dateDeRendu = new Date( a.dateDeRendu );
				newAssignment.remarque = a.remarque;
				newAssignment.note = a.note;
				newAssignment.rendu = a.rendu;

				this.addAssignment( newAssignment ).subscribe( () => { } );
			} );
		} );
	}
}