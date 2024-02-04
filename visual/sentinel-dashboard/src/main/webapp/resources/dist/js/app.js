'use strict';

/**
 * @ngdoc overview
 * @name sentinelDashboardApp
 * @description
 * # sentinelDashboardApp
 *
 * Main module of the application.
 */

angular
  .module('sentinelDashboardApp', [
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'ngDialog',
    'ui.bootstrap.datetimepicker',
    'ui-notification',
    'rzTable',
    'angular-clipboard',
    'selectize',
    'angularUtils.directives.dirPagination'
  ])
  .factory('AuthInterceptor', ['$window', '$state', function ($window, $state) {
    var authInterceptor = {
      'responseError' : function(response) {
        if (response.status === 401) {
          // If not auth, clear session in localStorage and jump to the login page
          $window.localStorage.removeItem('session_sentinel_admin');
          $state.go('login');
        }

        return response;
      },
      'response' : function(response) {
        return response;
      },
      'request' : function(config) {
        return config;
      },
      'requestError' : function(config){
        return config;
      }
    };
    return authInterceptor;
  }])
  .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$httpProvider',
    function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $httpProvider) {
      $httpProvider.interceptors.push('AuthInterceptor');

      $ocLazyLoadProvider.config({
        debug: false,
        events: true,
      });

      $urlRouterProvider.otherwise('/dashboard/home');

      $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'app/views/login.html',
            controller: 'LoginCtl',
            resolve: {
                loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sentinelDashboardApp',
                        files: [
                            'app/scripts/controllers/login.js',
                        ]
                    });
                }]
            }
        })

      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/views/dashboard/main.html',
        resolve: {
          loadMyDirectives: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'sentinelDashboardApp',
                files: [
                  'app/scripts/directives/header/header.js',
                  'app/scripts/directives/sidebar/sidebar.js',
                  'app/scripts/directives/sidebar/sidebar-search/sidebar-search.js',
                ]
              });
          }]
        }
      })

      .state('dashboard.home', {
        url: '/home',
        templateUrl: 'app/views/dashboard/home.html',
        resolve: {
          loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'sentinelDashboardApp',
              files: [
                'app/scripts/controllers/main.js',
              ]
            });
          }]
        }
      })

      .state('dashboard.flowV1', {
        templateUrl: 'app/views/flow_v1.html',
        url: '/flow/:app',
        controller: 'FlowControllerV1',
        resolve: {
          loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'sentinelDashboardApp',
              files: [
                'app/scripts/controllers/flow_v1.js',
              ]
            });
          }]
        }
      })

      .state('dashboard.flow', {
          templateUrl: 'app/views/flow_v2.html',
          url: '/v2/flow/:app',
          controller: 'FlowControllerV2',
          resolve: {
              loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'sentinelDashboardApp',
                      files: [
                          'app/scripts/controllers/flow_v2.js',
                      ]
                  });
              }]
          }
      })

      .state('dashboard.paramFlow', {
        templateUrl: 'app/views/param_flow.html',
        url: '/paramFlow/:app',
        controller: 'ParamFlowController',
        resolve: {
          loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'sentinelDashboardApp',
              files: [
                'app/scripts/controllers/param_flow.js',
              ]
            });
          }]
        }
      })

      .state('dashboard.clusterAppAssignManage', {
          templateUrl: 'app/views/cluster_app_assign_manage.html',
          url: '/cluster/assign_manage/:app',
          controller: 'SentinelClusterAppAssignManageController',
          resolve: {
              loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'sentinelDashboardApp',
                      files: [
                          'app/scripts/controllers/cluster_app_assign_manage.js',
                      ]
                  });
              }]
          }
      })

      .state('dashboard.clusterAppServerList', {
          templateUrl: 'app/views/cluster_app_server_list.html',
          url: '/cluster/server/:app',
          controller: 'SentinelClusterAppServerListController',
          resolve: {
              loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'sentinelDashboardApp',
                      files: [
                          'app/scripts/controllers/cluster_app_server_list.js',
                      ]
                  });
              }]
          }
      })

      .state('dashboard.clusterAppClientList', {
          templateUrl: 'app/views/cluster_app_client_list.html',
          url: '/cluster/client/:app',
          controller: 'SentinelClusterAppTokenClientListController',
          resolve: {
              loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'sentinelDashboardApp',
                      files: [
                          'app/scripts/controllers/cluster_app_token_client_list.js',
                      ]
                  });
              }]
          }
      })

      .state('dashboard.clusterSingle', {
          templateUrl: 'app/views/cluster_single_config.html',
          url: '/cluster/single/:app',
          controller: 'SentinelClusterSingleController',
          resolve: {
              loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'sentinelDashboardApp',
                      files: [
                          'app/scripts/controllers/cluster_single.js',
                      ]
                  });
              }]
          }
      })

      .state('dashboard.authority', {
            templateUrl: 'app/views/authority.html',
            url: '/authority/:app',
            controller: 'AuthorityRuleController',
            resolve: {
                loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sentinelDashboardApp',
                        files: [
                            'app/scripts/controllers/authority.js',
                        ]
                    });
                }]
            }
       })

      .state('dashboard.degrade', {
        templateUrl: 'app/views/degrade.html',
        url: '/degrade/:app',
        controller: 'DegradeCtl',
        resolve: {
          loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'sentinelDashboardApp',
              files: [
                'app/scripts/controllers/degrade.js',
              ]
            });
          }]
        }
      })

      .state('dashboard.system', {
        templateUrl: 'app/views/system.html',
        url: '/system/:app',
        controller: 'SystemCtl',
        resolve: {
          loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'sentinelDashboardApp',
              files: [
                'app/scripts/controllers/system.js',
              ]
            });
          }]
        }
      })

      .state('dashboard.machine', {
        templateUrl: 'app/views/machine.html',
        url: '/app/:app',
        controller: 'MachineCtl',
        resolve: {
          loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'sentinelDashboardApp',
              files: [
                'app/scripts/controllers/machine.js',
              ]
            });
          }]
        }
      })

      .state('dashboard.identity', {
        templateUrl: 'app/views/identity.html',
        url: '/identity/:app',
        controller: 'IdentityCtl',
        resolve: {
          loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'sentinelDashboardApp',
              files: [
                'app/scripts/controllers/identity.js',
              ]
            });
          }]
        }
      })

      .state('dashboard.gatewayIdentity', {
        templateUrl: 'app/views/gateway/identity.html',
        url: '/gateway/identity/:app',
        controller: 'GatewayIdentityCtl',
        resolve: {
          loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'sentinelDashboardApp',
              files: [
                'app/scripts/controllers/gateway/identity.js',
              ]
            });
          }]
        }
      })

      .state('dashboard.metric', {
        templateUrl: 'app/views/metric.html',
        url: '/metric/:app',
        controller: 'MetricCtl',
        resolve: {
          loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'sentinelDashboardApp',
              files: [
                'app/scripts/controllers/metric.js',
              ]
            });
          }]
        }
      })

      .state('dashboard.gatewayApi', {
        templateUrl: 'app/views/gateway/api.html',
        url: '/gateway/api/:app',
        controller: 'GatewayApiCtl',
        resolve: {
          loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'sentinelDashboardApp',
              files: [
                'app/scripts/controllers/gateway/api.js',
              ]
            });
          }]
        }
      })

      .state('dashboard.gatewayFlow', {
          templateUrl: 'app/views/gateway/flow.html',
          url: '/gateway/flow/:app',
          controller: 'GatewayFlowCtl',
          resolve: {
              loadMyFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'sentinelDashboardApp',
                      files: [
                          'app/scripts/controllers/gateway/flow.js',
                      ]
                  });
              }]
          }
      });
  }]);
var app = angular.module('sentinelDashboardApp');

app.filter('range', [function () {
  return function (input, length) {
    if (isNaN(length) || length <= 0) {
      return [];
    }

    input = [];
    for (var index = 1; index <= length; index++) {
      input.push(index);
    }

    return input;
  };
  
}]);

var app = angular.module('sentinelDashboardApp');

app.service('VersionService', ['$http', function ($http) {
  this.version = function () {
    return $http({
      url: '/version',
      method: 'GET'
    });
  };
}]);

var app = angular.module('sentinelDashboardApp');

app.service('AuthService', ['$http', function ($http) {
  this.check = function () {
    return $http({
      url: '/auth/check',
      method: 'POST'
    });
  };

  this.login = function (param) {
    return $http({
      url: '/auth/login',
      params: param,
      method: 'POST'
    });
  };

  this.logout = function () {
    return $http({
      url: '/auth/logout',
      method: 'POST'
    });
  };
}]);


var app = angular.module('sentinelDashboardApp');

app.service('AppService', ['$http', function ($http) {
  this.getApps = function () {
    return $http({
      // url: 'app/mock_infos',
      url: 'app/briefinfos.json',
      method: 'GET'
    });
  };
}]);

var app = angular.module('sentinelDashboardApp');

app.service('FlowServiceV1', ['$http', function ($http) {
    this.queryMachineRules = function (app, ip, port) {
        var param = {
            app: app,
            ip: ip,
            port: port
        };
        return $http({
            url: '/v1/flow/rules',
            params: param,
            method: 'GET'
        });
    };

    this.newRule = function (rule) {
        var param = {
            resource: rule.resource,
            limitApp: rule.limitApp,
            grade: rule.grade,
            count: rule.count,
            strategy: rule.strategy,
            refResource: rule.refResource,
            controlBehavior: rule.controlBehavior,
            warmUpPeriodSec: rule.warmUpPeriodSec,
            maxQueueingTimeMs: rule.maxQueueingTimeMs,
            app: rule.app,
            ip: rule.ip,
            port: rule.port
        };

        return $http({
            url: '/v1/flow/rule',
            data: rule,
            method: 'POST'
        });
    };

    this.saveRule = function (rule) {
        var param = {
            id: rule.id,
            resource: rule.resource,
            limitApp: rule.limitApp,
            grade: rule.grade,
            count: rule.count,
            strategy: rule.strategy,
            refResource: rule.refResource,
            controlBehavior: rule.controlBehavior,
            warmUpPeriodSec: rule.warmUpPeriodSec,
            maxQueueingTimeMs: rule.maxQueueingTimeMs,
        };

        return $http({
            url: '/v1/flow/save.json',
            params: param,
            method: 'PUT'
        });
    };

    this.deleteRule = function (rule) {
        var param = {
            id: rule.id,
            app: rule.app
        };

        return $http({
            url: '/v1/flow/delete.json',
            params: param,
            method: 'DELETE'
        });
    };

    function notNumberAtLeastZero(num) {
        return num === undefined || num === '' || isNaN(num) || num < 0;
    }

    function notNumberGreaterThanZero(num) {
        return num === undefined || num === '' || isNaN(num) || num <= 0;
    }

    this.checkRuleValid = function (rule) {
        if (rule.resource === undefined || rule.resource === '') {
            alert('资源名称不能为空');
            return false;
        }
        if (rule.count === undefined || rule.count < 0) {
            alert('限流阈值必须大于等于 0');
            return false;
        }
        if (rule.strategy === undefined || rule.strategy < 0) {
            alert('无效的流控模式');
            return false;
        }
        if (rule.strategy == 1 || rule.strategy == 2) {
            if (rule.refResource === undefined || rule.refResource == '') {
                alert('请填写关联资源或入口');
                return false;
            }
        }
        if (rule.controlBehavior === undefined || rule.controlBehavior < 0) {
            alert('无效的流控整形方式');
            return false;
        }
        if (rule.controlBehavior == 1 && notNumberGreaterThanZero(rule.warmUpPeriodSec)) {
            alert('预热时长必须大于 0');
            return false;
        }
        if (rule.controlBehavior == 2 && notNumberGreaterThanZero(rule.maxQueueingTimeMs)) {
            alert('排队超时时间必须大于 0');
            return false;
        }
        if (rule.clusterMode && (rule.clusterConfig === undefined || rule.clusterConfig.thresholdType === undefined)) {
            alert('集群限流配置不正确');
            return false;
        }
        return true;
    };
}]);

var app = angular.module('sentinelDashboardApp');

app.service('FlowServiceV2', ['$http', function ($http) {
    this.queryMachineRules = function (app, ip, port) {
        var param = {
            app: app,
            ip: ip,
            port: port
        };
        return $http({
            url: '/v2/flow/rules',
            params: param,
            method: 'GET'
        });
    };

    this.newRule = function (rule) {
        return $http({
            url: '/v2/flow/rule',
            data: rule,
            method: 'POST'
        });
    };

    this.saveRule = function (rule) {
        return $http({
            url: '/v2/flow/rule/' + rule.id,
            data: rule,
            method: 'PUT'
        });
    };

    this.deleteRule = function (rule) {
        return $http({
            url: '/v2/flow/rule/' + rule.id,
            method: 'DELETE'
        });
    };

    function notNumberAtLeastZero(num) {
        return num === undefined || num === '' || isNaN(num) || num < 0;
    }

    function notNumberGreaterThanZero(num) {
        return num === undefined || num === '' || isNaN(num) || num <= 0;
    }

    this.checkRuleValid = function (rule) {
        if (rule.resource === undefined || rule.resource === '') {
            alert('资源名称不能为空');
            return false;
        }
        if (rule.count === undefined || rule.count < 0) {
            alert('限流阈值必须大于等于 0');
            return false;
        }
        if (rule.strategy === undefined || rule.strategy < 0) {
            alert('无效的流控模式');
            return false;
        }
        if (rule.strategy == 1 || rule.strategy == 2) {
            if (rule.refResource === undefined || rule.refResource == '') {
                alert('请填写关联资源或入口');
                return false;
            }
        }
        if (rule.controlBehavior === undefined || rule.controlBehavior < 0) {
            alert('无效的流控整形方式');
            return false;
        }
        if (rule.controlBehavior == 1 && notNumberGreaterThanZero(rule.warmUpPeriodSec)) {
            alert('预热时长必须大于 0');
            return false;
        }
        if (rule.controlBehavior == 2 && notNumberGreaterThanZero(rule.maxQueueingTimeMs)) {
            alert('排队超时时间必须大于 0');
            return false;
        }
        if (rule.clusterMode && (rule.clusterConfig === undefined || rule.clusterConfig.thresholdType === undefined)) {
            alert('集群限流配置不正确');
            return false;
        }
        return true;
    };
}]);

var app = angular.module('sentinelDashboardApp');

app.service('DegradeService', ['$http', function ($http) {
  this.queryMachineRules = function (app, ip, port) {
    var param = {
      app: app,
      ip: ip,
      port: port
    };
    return $http({
      url: 'degrade/rules.json',
      params: param,
      method: 'GET'
    });
  };

  this.newRule = function (rule) {
    return $http({
        url: '/degrade/rule',
        data: rule,
        method: 'POST'
    });
  };

  this.saveRule = function (rule) {
    var param = {
      id: rule.id,
      resource: rule.resource,
      limitApp: rule.limitApp,
      grade: rule.grade,
      count: rule.count,
      timeWindow: rule.timeWindow,
        statIntervalMs: rule.statIntervalMs,
        minRequestAmount: rule.minRequestAmount,
        slowRatioThreshold: rule.slowRatioThreshold,
    };
    return $http({
        url: '/degrade/rule/' + rule.id,
        data: param,
        method: 'PUT'
    });
  };

  this.deleteRule = function (rule) {
      return $http({
          url: '/degrade/rule/' + rule.id,
          method: 'DELETE'
      });
  };

  this.checkRuleValid = function (rule) {
      if (rule.resource === undefined || rule.resource === '') {
          alert('资源名称不能为空');
          return false;
      }
      if (rule.grade === undefined || rule.grade < 0) {
          alert('未知的降级策略');
          return false;
      }
      if (rule.count === undefined || rule.count === '' || rule.count < 0) {
          alert('降级阈值不能为空或小于 0');
          return false;
      }
      if (rule.timeWindow == undefined || rule.timeWindow === '' || rule.timeWindow <= 0) {
          alert('熔断时长必须大于 0s');
          return false;
      }
      if (rule.minRequestAmount == undefined || rule.minRequestAmount <= 0) {
          alert('最小请求数目需大于 0');
          return false;
      }
      if (rule.statIntervalMs == undefined || rule.statIntervalMs <= 0) {
          alert('统计窗口时长需大于 0s');
          return false;
      }
      if (rule.statIntervalMs !== undefined && rule.statIntervalMs > 60 * 1000 * 2) {
          alert('统计窗口时长不能超过 120 分钟');
          return false;
      }
      // 异常比率类型.
      if (rule.grade == 1 && rule.count > 1) {
          alert('异常比率超出范围：[0.0 - 1.0]');
          return false;
      }
      if (rule.grade == 0) {
          if (rule.slowRatioThreshold == undefined) {
              alert('慢调用比率不能为空');
              return false;
          }
          if (rule.slowRatioThreshold < 0 || rule.slowRatioThreshold > 1) {
              alert('慢调用比率超出范围：[0.0 - 1.0]');
              return false;
          }
      }
      return true;
  };
}]);

var app = angular.module('sentinelDashboardApp');

app.service('SystemService', ['$http', function ($http) {
  this.queryMachineRules = function (app, ip, port) {
    var param = {
      app: app,
      ip: ip,
      port: port
    };
    return $http({
      url: 'system/rules.json',
      params: param,
      method: 'GET'
    });
  };

  this.newRule = function (rule) {
    var param = {
      app: rule.app,
      ip: rule.ip,
      port: rule.port
    };
    if (rule.grade == 0) {// avgLoad
      param.highestSystemLoad = rule.highestSystemLoad;
    } else if (rule.grade == 1) {// avgRt
      param.avgRt = rule.avgRt;
    } else if (rule.grade == 2) {// maxThread
      param.maxThread = rule.maxThread;
    } else if (rule.grade == 3) {// qps
      param.qps = rule.qps;
    } else if (rule.grade == 4) {// cpu
      param.highestCpuUsage = rule.highestCpuUsage;
    }

    return $http({
      url: '/system/new.json',
      params: param,
      method: 'GET'
    });
  };

  this.saveRule = function (rule) {
    var param = {
      id: rule.id,
    };
    if (rule.grade == 0) {// avgLoad
      param.highestSystemLoad = rule.highestSystemLoad;
    } else if (rule.grade == 1) {// avgRt
      param.avgRt = rule.avgRt;
    } else if (rule.grade == 2) {// maxThread
      param.maxThread = rule.maxThread;
    } else if (rule.grade == 3) {// qps
      param.qps = rule.qps;
    } else if (rule.grade == 4) {// cpu
        param.highestCpuUsage = rule.highestCpuUsage;
    }

    return $http({
      url: '/system/save.json',
      params: param,
      method: 'GET'
    });
  };

  this.deleteRule = function (rule) {
    var param = {
      id: rule.id,
      app: rule.app
    };

    return $http({
      url: '/system/delete.json',
      params: param,
      method: 'GET'
    });
  };
}]);

var app = angular.module('sentinelDashboardApp');

app.service('MachineService', ['$http', '$httpParamSerializerJQLike',
  function ($http, $httpParamSerializerJQLike) {
    this.getAppMachines = function (app) {
      return $http({
        url: 'app/' + app + '/machines.json',
        method: 'GET'
      });
    };
    this.removeAppMachine = function (app, ip, port) {
      return $http({
        url: 'app/' + app + '/machine/remove.json',
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: $httpParamSerializerJQLike({
          ip: ip,
          port: port
        })
      });
    };
  }]
);

var app = angular.module('sentinelDashboardApp');

app.service('IdentityService', ['$http', function ($http) {

  this.fetchIdentityOfMachine = function (ip, port, searchKey) {
    var param = {
      ip: ip,
      port: port,
      searchKey: searchKey
    };
    return $http({
      url: 'resource/machineResource.json',
      params: param,
      method: 'GET'
    });
  };
  this.fetchClusterNodeOfMachine = function (ip, port, searchKey) {
    var param = {
      ip: ip,
      port: port,
      type: 'cluster',
      searchKey: searchKey
    };
    return $http({
      url: 'resource/machineResource.json',
      params: param,
      method: 'GET'
    });
  };
}]);

var app = angular.module('sentinelDashboardApp');

app.service('MetricService', ['$http', function ($http) {

  this.queryAppSortedIdentities = function (params) {
    return $http({
      url: '/metric/queryTopResourceMetric.json',
      params: params,
      method: 'GET'
    });
  };

  this.queryByAppAndIdentity = function (params) {
    return $http({
      url: '/metric/queryByAppAndResource.json',
      params: params,
      method: 'GET'
    });
  };

  this.queryByMachineAndIdentity = function (ip, port, identity, startTime, endTime) {
    var param = {
      ip: ip,
      port: port,
      identity: identity,
      startTime: startTime.getTime(),
      endTime: endTime.getTime()
    };

    return $http({
      url: '/metric/queryByAppAndResource.json',
      params: param,
      method: 'GET'
    });
  };
}]);

/**
 * Parameter flow control service.
 * 
 * @author Eric Zhao
 */
angular.module('sentinelDashboardApp').service('ParamFlowService', ['$http', function ($http) {
  this.queryMachineRules = function(app, ip, port) {
    var param = {
      app: app,
      ip: ip,
      port: port
    };
    return $http({
      url: '/paramFlow/rules',
      params: param,
      method: 'GET'
    });
  };

  this.addNewRule = function(rule) {
    return $http({
      url: '/paramFlow/rule',
      data: rule,
      method: 'POST'
    });
  };

  this.saveRule = function (entity) {
    return $http({
      url: '/paramFlow/rule/' + entity.id,
      data: entity,
      method: 'PUT'
    });
  };

  this.deleteRule = function (entity) {
    return $http({
      url: '/paramFlow/rule/' + entity.id,
      method: 'DELETE'
    });
  };

    function isNumberClass(classType) {
        return classType === 'int' || classType === 'double' ||
            classType === 'float' || classType === 'long' || classType === 'short';
    }

    function isByteClass(classType) {
        return classType === 'byte';
    }

    function notNumberAtLeastZero(num) {
        return num === undefined || num === '' || isNaN(num) || num < 0;
    }

    function notGoodNumber(num) {
        return num === undefined || num === '' || isNaN(num);
    }

    function notGoodNumberBetweenExclusive(num, l ,r) {
        return num === undefined || num === '' || isNaN(num) || num < l || num > r;
    }

    function notValidParamItem(curExItem) {
        if (isNumberClass(curExItem.classType) && notGoodNumber(curExItem.object)) {
            return true;
        }
        if (isByteClass(curExItem.classType) && notGoodNumberBetweenExclusive(curExItem.object, -128, 127)) {
            return true;
        }
        return curExItem.object === undefined || curExItem.classType === undefined ||
            notNumberAtLeastZero(curExItem.count);
    }

  this.checkRuleValid = function (rule) {
      if (!rule.resource || rule.resource === '') {
          alert('资源名称不能为空');
          return false;
      }
      if (rule.grade != 1) {
          alert('未知的限流模式');
          return false;
      }
      if (rule.count < 0) {
          alert('限流阈值必须大于等于 0');
          return false;
      }
      if (rule.paramIdx === undefined || rule.paramIdx === '' || isNaN(rule.paramIdx) || rule.paramIdx < 0) {
          alert('热点参数索引必须大于等于 0');
          return false;
      }
      if (rule.paramFlowItemList !== undefined) {
          for (var i = 0; i < rule.paramFlowItemList.length; i++) {
              var item = rule.paramFlowItemList[i];
              if (notValidParamItem(item)) {
                  alert('热点参数例外项不合法，请检查值和类型是否正确：参数为 ' + item.object + ', 类型为 ' +
                      item.classType + ', 限流阈值为 ' + item.count);
                  return false;
              }
          }
      }
      return true;
  };
}]);

/**
 * Authority rule service.
 */
angular.module('sentinelDashboardApp').service('AuthorityRuleService', ['$http', function ($http) {
    this.queryMachineRules = function(app, ip, port) {
        var param = {
            app: app,
            ip: ip,
            port: port
        };
        return $http({
            url: '/authority/rules',
            params: param,
            method: 'GET'
        });
    };

    this.addNewRule = function(rule) {
        return $http({
            url: '/authority/rule',
            data: rule,
            method: 'POST'
        });
    };

    this.saveRule = function (entity) {
        return $http({
            url: '/authority/rule/' + entity.id,
            data: entity,
            method: 'PUT'
        });
    };

    this.deleteRule = function (entity) {
        return $http({
            url: '/authority/rule/' + entity.id,
            method: 'DELETE'
        });
    };

    this.checkRuleValid = function checkRuleValid(rule) {
        if (rule.resource === undefined || rule.resource === '') {
            alert('资源名称不能为空');
            return false;
        }
        if (rule.limitApp === undefined || rule.limitApp === '') {
            alert('流控针对应用不能为空');
            return false;
        }
        if (rule.strategy === undefined) {
            alert('必须选择黑白名单模式');
            return false;
        }
        return true;
    };
}]);

/**
 * Cluster state control service.
 *
 * @author Eric Zhao
 */
angular.module('sentinelDashboardApp').service('ClusterStateService', ['$http', function ($http) {

    this.fetchClusterUniversalStateSingle = function(app, ip, port) {
        var param = {
            app: app,
            ip: ip,
            port: port
        };
        return $http({
            url: '/cluster/state_single',
            params: param,
            method: 'GET'
        });
    };

    this.fetchClusterUniversalStateOfApp = function(app) {
        return $http({
            url: '/cluster/state/' + app,
            method: 'GET'
        });
    };

    this.fetchClusterServerStateOfApp = function(app) {
        return $http({
            url: '/cluster/server_state/' + app,
            method: 'GET'
        });
    };

    this.fetchClusterClientStateOfApp = function(app) {
        return $http({
            url: '/cluster/client_state/' + app,
            method: 'GET'
        });
    };

    this.modifyClusterConfig = function(config) {
        return $http({
            url: '/cluster/config/modify_single',
            data: config,
            method: 'POST'
        });
    };

    this.applyClusterFullAssignOfApp = function(app, clusterMap) {
        return $http({
            url: '/cluster/assign/all_server/' + app,
            data: clusterMap,
            method: 'POST'
        });
    };

    this.applyClusterSingleServerAssignOfApp = function(app, request) {
        return $http({
            url: '/cluster/assign/single_server/' + app,
            data: request,
            method: 'POST'
        });
    };

    this.applyClusterServerBatchUnbind = function(app, machineSet) {
        return $http({
            url: '/cluster/assign/unbind_server/' + app,
            data: machineSet,
            method: 'POST'
        });
    };
}]);

var app = angular.module('sentinelDashboardApp');

app.service('GatewayApiService', ['$http', function ($http) {
  this.queryApis = function (app, ip, port) {
    var param = {
      app: app,
      ip: ip,
      port: port
    };
    return $http({
      url: '/gateway/api/list.json',
      params: param,
      method: 'GET'
    });
  };

  this.newApi = function (api) {
    return $http({
      url: '/gateway/api/new.json',
      data: api,
      method: 'POST'
    });
  };

  this.saveApi = function (api) {
    return $http({
      url: '/gateway/api/save.json',
      data: api,
      method: 'POST'
    });
  };

  this.deleteApi = function (api) {
    var param = {
      id: api.id,
      app: api.app
    };
    return $http({
      url: '/gateway/api/delete.json',
      params: param,
      method: 'POST'
    });
  };

  this.checkApiValid = function (api, apiNames) {
    if (api.apiName === undefined || api.apiName === '') {
      alert('API名称不能为空');
      return false;
    }

    if (api.predicateItems == null || api.predicateItems.length === 0) {
      // Should never happen since no remove button will display when only one predicateItem.
      alert('至少有一个匹配规则');
      return false;
    }

    for (var i = 0; i < api.predicateItems.length; i++) {
      var predicateItem = api.predicateItems[i];
      var pattern = predicateItem.pattern;
      if (pattern === undefined || pattern === '') {
        alert('匹配串不能为空，请检查');
        return false;
      }
    }

    if (apiNames.indexOf(api.apiName) !== -1) {
      alert('API名称(' + api.apiName + ')已存在');
      return false;
    }

    return true;
  };
}]);

var app = angular.module('sentinelDashboardApp');

app.service('GatewayFlowService', ['$http', function ($http) {
  this.queryRules = function (app, ip, port) {
    var param = {
      app: app,
      ip: ip,
      port: port
    };

    return $http({
      url: '/gateway/flow/list.json',
      params: param,
      method: 'GET'
    });
  };

  this.newRule = function (rule) {
    return $http({
      url: '/gateway/flow/new.json',
      data: rule,
      method: 'POST'
    });
  };

  this.saveRule = function (rule) {
    return $http({
      url: '/gateway/flow/save.json',
      data: rule,
      method: 'POST'
    });
  };

  this.deleteRule = function (rule) {
    var param = {
      id: rule.id,
      app: rule.app
    };

    return $http({
      url: '/gateway/flow/delete.json',
      params: param,
      method: 'POST'
    });
  };

  this.checkRuleValid = function (rule) {
    if (rule.resource === undefined || rule.resource === '') {
      alert('API名称不能为空');
      return false;
    }

    if (rule.paramItem != null) {
      if (rule.paramItem.parseStrategy == 2 ||
          rule.paramItem.parseStrategy == 3 ||
          rule.paramItem.parseStrategy == 4) {
        if (rule.paramItem.fieldName === undefined || rule.paramItem.fieldName === '') {
          alert('当参数属性为Header、URL参数、Cookie时，参数名称不能为空');
          return false;
        }

        if (rule.paramItem.pattern === '') {
          alert('匹配串不能为空');
          return false;
        }
      }
    }

    if (rule.count === undefined || rule.count < 0) {
      alert((rule.grade === 1 ? 'QPS阈值' : '线程数') + '必须大于等于 0');
      return false;
    }

    return true;
  };
}]);
