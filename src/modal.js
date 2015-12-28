(function() {
  'use strict';

  if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
    module.exports = 'tenphi.modal';
  }

  angular.module('tenphi.modal', [])
    .factory('Modal', ['$compile', '$sce', '$q', '$rootScope', function($compile, $sce, $q, $rootScope) {
      let instances = [];

      class Modal {
        constructor(options) {
          this.template = options.template;
          this.scope = $rootScope.$new(options.scope || {});
        }
        open() {
          if (this.opened) {
            return this.promise;
          }

          let deferred = $q.defer();

          this.opened = true;
          this.promise = deferred.promise;
          this.deferred = deferred;

          instances.push(this);

          this.promise.finally( () => {
            this.opened = false;
          instances.splice(instances.indexOf(this), 1);
        });

          return this.promise;
        }
      }

      Modal.instances = instances;

      return Modal;
    }])
    .directive('tnpModal', ['Modal', '$compile', function(Modal, $compile) {

      class tnpModalCtrl {
        constructor() {
          this.instances = Modal.instances;
        }
      }

      return {
        restrict: 'E',
        replace: true,
        template: ( require('./modal.less'), require('./modal.html') ),
        controller: tnpModalCtrl,
        controllerAs: 'modal'
      }
    }])
    .directive('tnpModalBind', ['$sce', '$compile', '$q', '$rootScope', function($sce, $compile, $q, $rootScope) {

      class tnpModalBindCtrl {
        constructor($scope, $element, $attrs) {
          let model = this.model;
          let deferred = model.deferred;
          let scope = model.scope;
          let template = angular.element(model.template);
          let linkFn = $compile(template);

          Object.assign(scope, this.model.scope || {});

          let element = linkFn(scope);

          $element.append(element);

          delete scope.deferred;

          scope.resolve = deferred.resolve;
          scope.reject = deferred.reject;
          scope.promise = deferred.promise;
        }
      }

      tnpModalBindCtrl.$inject = ['$scope', '$element', '$attrs'];

      return {
        restrict: 'A',
        controller: tnpModalBindCtrl,
        controllerAs: 'tnpModalBindCtrl',
        scope: false,
        bindToController: {
          model: '=tnpModalBind'
        }
      }
    }])

    .run(['$rootScope', '$document', '$compile', function($rootScope, $document, $compile) {
      let template = angular.element('<tnp-modal></tnp-modal>');
      let linkFn = $compile(template);
      let element = linkFn($rootScope)[0];
      let document = $document[0];

      document.body.appendChild(element);
    }]);

})();