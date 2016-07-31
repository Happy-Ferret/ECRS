/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 29/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.project.details')
		.controller('ProjectDetailsController', ProjectDetailsController);

	/** @ngInject */
	function ProjectDetailsController(project, crashLogsPostUrl) {
		var vm = this;
		// Variables
		vm.project = project;
		vm.crashLogsPostUrl = crashLogsPostUrl;
		vm.electronCode = "\nconst {crashReporter} = require('electron')\n\ncrashReporter.start({\n	productName: 'YourName'," +
			"\n	companyName: 'YourCompany',\n	submitURL: '" + crashLogsPostUrl + "'," +
			"\n	autoSubmit: true\n})\n";

		// Functions

		////////////////


		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

	}

})();
