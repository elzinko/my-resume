import React from 'react';

export default function project() {
  return (
    <>
      <div className="my-1 flex justify-between">
        <strong>
          <a href="https://osrd.fr/fr/">OSRD - DGEX Solutions - Saint-Denis</a>
        </strong>
        <p className="flex">
          <span className="ml-1 rounded bg-gray-600 px-2 py-1 text-xs text-white">
            Java 5
          </span>
          <span className="ml-1 rounded bg-gray-600 px-2 py-1 text-xs text-white">
            Maven 2
          </span>
        </p>
      </div>
      <ul className="mb-4 flex">
        <li>
          <a
            href="#"
            className="mr-1 rounded bg-blue-600 px-2 py-1 text-sm text-white"
          >
            Live
          </a>
        </li>
        <li>
          <a
            href="#"
            className="mr-1 rounded bg-blue-600 px-2 py-1 text-sm text-white"
          >
            Code
          </a>
        </li>
      </ul>
      <p className="text-xs">
        Activités d études et développement d un outil intranet de
        contractualisation des produits de type imprimés publicitaires proposés
        par LA POSTE dans ses établissements
      </p>
      <ul className="mx-4 list-disc text-xs">
        <li>SCRUM : 4 à 5 personnes + 2 PO</li>
        <li>TDD / Pair programming</li>
        <li>POC d une solution de test via Selenium Hub</li>
        <li>
          Planification des sprints, revues, rétrospectives, facilitation des
          mêlées quotidiennes
        </li>
        <li>
          Réalisation de présentations fonctionnelles et techniques pour l
          équipe
        </li>
      </ul>
    </>
  );
}
