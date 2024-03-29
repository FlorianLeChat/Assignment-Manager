import { Router } from "@angular/router";
import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { AuthService } from "./shared/auth.service";
import { CoursesService } from "./shared/courses.service";
import { AssignmentsService } from "./shared/assignments.service";

@Component( {
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: [ "./app.component.css" ]
} )

export class AppComponent
{
	// Titre du composant.
	title = "Application de gestion des devoirs à rendre";

	// Propriétés de l'email et du mot de passe.
	email = "";
	password = "";
	validator = new FormControl( "", [ Validators.required, Validators.email ] );

	// Bouton pour montrer/cache le mot de passe.
	hide = true;

	// État de connexion.
	isLogged = false;

	// L'utilisateur est-il un administrateur ?
	isAdmin = false;

	// Afficher ou cacher le formulaire.
	loginVisible = false;

	// Constructeur.
	constructor(
		private http: HttpClient,
		private authService: AuthService,
		private router: Router,
		private assignmentsService: AssignmentsService,
		private coursesService: CoursesService
	)
	{
		this.isLogged = this.authService.isLogged;
		this.isAdmin = this.authService.isAdmin;
	}

	// Méthode d'initialisation.
	ngOnInit(): void
	{
		// Vérification de la présence et de la validité d'un jeton d'authentification.
		const token = localStorage.getItem( "id_token" );
		const expiration = localStorage.getItem( "expires_at" );

		if ( token && expiration && Date.now() + this.authService.jwtDuration > +expiration )
		{
			// Si c'est un jeton valide alors on génère une nouvelle promesse afin de réaliser une requête HTTP à la base de données.
			this.http.post<any>( "http://localhost:8010/api/auth/token", null, {
				withCredentials: true,
				headers: new HttpHeaders( {
					"Authorization": "Bearer " + token,
					"Content-Type": "application/json"
				} )
			} )
				.subscribe( {
					next: ( httpData ) =>
					{
						// Lors de la réponse du serveur, on vérifie si la connexion a réussie.
						if ( httpData.auth === true )
						{
							// Dans ce cas, on définit également certains attributs de l'utilisateur (connecté, admin ?).
							this.isLogged = true;
							this.isAdmin = httpData.admin;
							this.authService.isLogged = true;
							this.authService.isAdmin = httpData.admin;

							// Redirection vers la page d'accueil.
							this.router.navigateByUrl( "/", { skipLocationChange: true } ).then( () =>
								this.router.navigate( [ "/home" ] )
							);
						}
					},
					error: () =>
					{
						// Si la connexion a échouée, on supprime les données de connexion.
						// Note : cela signifie les données sont invalides ou périmées.
						localStorage.removeItem( "id_token" );
						localStorage.removeItem( "expires_at" );
					}
				} );

		}
	}

	// Méthode pour se connecter.
	async login()
	{
		// Vérification de la présence d'un email/password
		if ( !this.email || !this.password ) { return; }

		// Appel du service d'authentification
		await this.authService.logIn( this.email, this.password );

		// Vérifie si l'utilisateur a été authentifié.
		if ( this.authService.isLogged )
		{
			// Le formulaire de connexion est caché.
			this.loginVisible = false;

			// L'utilisateur est connecté.
			this.isLogged = this.authService.isLogged;

			// Détermine si c'est un administrateur grâce au service d'authentification.
			this.isAdmin = this.authService.isAdmin;

			// Redirection vers la page d'accueil.
			this.router.navigateByUrl( "/", { skipLocationChange: true } ).then( () =>
				this.router.navigate( [ "/home" ] )
			);
		}
		else
		{
			alert( "Email ou mot de passe incorrect" );
		}

		// Réinitialisation du formulaire
		this.email = "";
		this.password = "";
	}

	// Méthode pour se déconnecter.
	logout()
	{
		// Utilisateur/administrateur déconnecté.
		this.isLogged = false;
		this.isAdmin = false;

		// Déconnexion du service d'authentification.
		this.authService.logOut();

		// Suppression des données de connexion.
		localStorage.removeItem( "id_token" );
		localStorage.removeItem( "expires_at" );

		// Redirection vers la page d'accueil.
		this.router.navigateByUrl( "/", { skipLocationChange: true } ).then( () =>
			this.router.navigate( [ "/home" ] )
		);
	}

	// Méthode pour afficher le formulaire de connexion.
	showLogin()
	{
		// Formulaire de connexion visible.
		this.loginVisible = true;
	}

	// Méthode pour afficher les messages d'erreur.
	getErrorMessage()
	{
		if ( this.validator?.hasError( "required" ) )
		{
			return "Vous devez entrer une valeur";
		}

		return this.validator?.hasError( "email" ) ? "Ce n'est pas une adresse email valide" : "";
	}

	// Méthode pour insérer des données de test dans la base de données.
	initialiserLaBaseAvecDonneesDeTest()
	{
		this.coursesService.peuplerBDAvecForkJoin().subscribe( () =>
		{
			this.assignmentsService.peuplerBDAvecForkJoin();
		} );
	}
}