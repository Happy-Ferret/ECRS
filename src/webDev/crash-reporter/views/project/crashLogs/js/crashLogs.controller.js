/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 09/08/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.views.project.crashLogs')
        .controller('CrashLogsController', CrashLogsController);

    /** @ngInject */
    function CrashLogsController(projectsService, configurationService, project) {
        var vm = this;
        // Variables
        var baseCrashLogsDownloadUrl = configurationService.getBaseCrashLogsDownloadUrl();
        vm.query = {
            order: '-date', // '-' => desc / '' => asc
            limit: 5,
            page: 1,
            pages: [],
            rowsPerPage: [5, 10, 15],
            items: {
                min: null,
                max: null
            }
        };
        vm.data = {
            total: 0,
            items: []
        };
        // Functions
        vm.getElements = getElements;
        vm.nextPage = nextPage;
        vm.previousPage = previousPage;
        vm.changeRowPage = changeRowPage;
        vm.getCrashLogsDownloadUrl = getCrashLogsDownloadUrl;

        // Activate
        activate();

        ////////////////

        /* ************************************* */
        /* ********  PRIVATE FUNCTIONS  ******** */
        /* ************************************* */

        /**
         * Activate.
         */
        function activate() {
            vm.getElements();
        }

        /* ************************************* */
        /* ********   PUBLIC FUNCTIONS  ******** */
        /* ************************************* */

        /**
         * Get Crash Logs Download Url.
         * @param uploadFileMinidumpId
         * @returns {*}
         */
        function getCrashLogsDownloadUrl(uploadFileMinidumpId) {
            return baseCrashLogsDownloadUrl + uploadFileMinidumpId;
        }

        /**
         * Change Row page.
         */
        function changeRowPage() {
            vm.query.page = 1;
            getElements();
        }

        /**
         * Previous page.
         */
        function previousPage() {
            vm.query.page--;
            getElements();
        }

        /**
         * Next page.
         */
        function nextPage() {
            vm.query.page++;
            getElements();
        }

        /**
         * Get Elements.
         */
        function getElements() {
            var sort = {};
            // Create sort object
            var text = vm.query.order;
            if (text[0] === '-') {
                sort[text.substr(1, text.length)] = 'desc';
            }
            else {
                sort[text] = 'asc';
            }

            // Send request
            projectsService
                .getProjectCrashLogs(project, vm.query.limit, vm.query.limit * (vm.query.page - 1), sort)
                .then(function (data) {
                    // Change date
                    data.items.forEach(function (item) {
                        item.displayDate = moment(item.date).format('MMM-DD-YYYY');
                        item.notificationDate = moment(item.date).format('MMM-DD-YYYY HH:mm');
                    });
                    // Put data in
                    vm.data = data;
                    // Update items
                    vm.query.items.min = vm.query.limit * (vm.query.page - 1) + 1;
                    var max = vm.query.limit * vm.query.page;
                    vm.query.items.max = (max > data.total) ? data.total : max;
                    // Update pages
                    var maxPage = Math.ceil(data.total / vm.query.limit);
                    var pages = [];
                    for (var i = 1; i <= maxPage; i++) {
                        pages.push(i);
                    }
                    vm.query.pages = pages;
                });
        }

    }

})();
