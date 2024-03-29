import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Course } from "../models/course.model";
import { initialCourses } from "./data";

@Injectable( {
	providedIn: "root"
} )

export class CoursesService
{
	private HttpOptions = {
		headers: new HttpHeaders( {
			"Content-Type": "application/json"
		} )
	};

	courses: Course[] = [];

	constructor( private http: HttpClient ) { }

	url = "http://localhost:8010/api/courses";

	// Récupération de toutes les matières.
	getCourses( page: number, limit: number ): Observable<any>
	{
		return this.http.get<any>( this.url + "?page=" + page + "&limit=" + limit );
	}

	// Récupération d'une seule matière.
	getCourse( id: number ): Observable<Course>
	{
		return this.http.get<Course>( this.url + "/" + id );
	}

	// Récupération de toutes les matières.
	addCourse( course: Course ): Observable<any>
	{
		return this.http.post<Course>( this.url, course, this.HttpOptions );
	}

	// Modification d'une matière.
	updateCourse( course: Course ): Observable<any>
	{
		return this.http.put<Course>( this.url, course );
	}

	// Suppression d'une matière.
	deleteCourse( course: Course ): Observable<any>
	{
		return this.http.delete( this.url + "/" + course._id );
	}

	// Peuplement des matières.
	peuplerBDAvecForkJoin(): Observable<any>
	{
		const appelsVersAddCourse: any = [];

		initialCourses.forEach( ( a ) =>
		{
			const newCourse: any = new Course();
			newCourse.id = a.id;
			newCourse.nom = a.nom;
			newCourse.teacherName = a.teacherName;
			newCourse.teacherAvatar = a.teacherAvatar;

			appelsVersAddCourse.push( this.addCourse( newCourse ) );
		} );

		return forkJoin( appelsVersAddCourse );
	}
}