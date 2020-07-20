/**
 * @NApiVersion 2.x
 * @NScriptType scheduledscript
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/search', 'N/task'],
  function (runtime, search, task) {

    /**
     * Scheduled script.
     *
     * @param context
     * @param context.type
     */
    function execute (context) {
      var scriptObj = runtime.getCurrentScript();
      var customerId = scriptObj.getParameter({ name: 'custscript_customer_id' });

      log.debug({ title: 'customerId ' + customerId });

      var senhaApi = scriptObj.getParameter({ name: 'custscript_senha_api' });

      log.debug({ title: 'senhaApi ' + senhaApi });

      /* search.create({
        type: search.Type.CUSTOMER,
        filters: [{
          name: 'custentity_processado',
          operator: search.Operator.IS,
          value: false
        }],
        columns: [{
          name: 'isperson'
        }, {
          name: 'firstname'
        }, {
          name: 'lastname'
        }, {
          name: 'companyname'
        }]
      })
        .run()
        .getRange({
          start: 0,
          end: 1000
        })
        .forEach(function (result) {

          log.debug('Remaining governance units: ' + scriptObj.getRemainingUsage());

          if (scriptObj.getRemainingUsage() < 100) {

            var mrTask = task.create({
              taskType: task.TaskType.SCHEDULED_SCRIPT,
              scriptId: scriptObj.id,
              // deploymentId: 'custdeploy1',
              params: {
                doSomething: true
              }
            })

            mrTask.submit()
          } else {

            var customer = record.load({
              type: record.Type.CUSTOMER,
              id: result.id
            });

            customer.setValue({
              fieldID: 'custentity_processado',
              value: true
            });

            customer.save()

          }
        })*/
    }

    return {
      execute: execute
    }
  })
