import { Component, OnInit } from '@angular/core';

@Component( {
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: [ './assignments.component.css' ]
} )
export class AssignmentsComponent implements OnInit
{
  assignments = [
    {
      nom: "Devoir Angular à rendre",
      dateDeRendu: "2022-10-10",
      rendu: false
    },
    {
      nom: "Devoir Java à rendre",
      dateDeRendu: "2022-09-10",
      rendu: false
    },
    {
      nom: "Devoir BD à rendre",
      dateDeRendu: "2022-11-10",
      rendu: false
    },
  ];

  constructor() { }

  ngOnInit(): void
  {
  }

}
