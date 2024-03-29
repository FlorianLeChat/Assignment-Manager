import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable( {
	providedIn: "root"
} )

export class AuthService
{
	private HttpOptions = {
		headers: new HttpHeaders( {
			"Content-Type": "application/json"
		} )
	};

	// État de connexion de l'utilisateur.
	isLogged = false;

	// L'utilisateur est-il un administrateur ?
	isAdmin = false;

	// Durée de validité d'un jeton d'authentification (1 jour).
	jwtDuration = 86400 * 1000;

	// Constructeur de la classe.
	constructor( private http: HttpClient ) { }

	// Fonction d'authentification.
	logIn( email: any, password: string )
	{
		// On active une nouvelle promesse afin de réaliser une requête HTTP à la base de données.
		return new Promise( ( resolve, _reject ) =>
		{
			this.http.post<any>( "http://localhost:8010/api/auth/login", { email: email, password: password }, this.HttpOptions )
				.subscribe( {
					next: ( httpData ) =>
					{
						// Lors de la réponse du serveur, on vérifie si la connexion a réussi.
						if ( httpData.auth === true )
						{
							// Si la connexion a réussie, on stocke le jeton d'authentification et sa date d'expiration.
							localStorage.setItem( "id_token", httpData.token );
							localStorage.setItem( "expires_at", ( new Date().getTime() + this.jwtDuration ).toString() );

							// Aussi, on définit les attributs de l'utilisateur (connecté, admin ?).
							this.isLogged = true;
							this.isAdmin = httpData.admin;
						}

						// Résolution de la promesse.
						resolve( httpData );
					},
					error: ( httpError ) =>
					{
						resolve( httpError );
					}
				} );
		} );
	}

	// Fonction de déconnexion.
	logOut()
	{
		this.isLogged = false;
		this.isAdmin = false;
	}
}