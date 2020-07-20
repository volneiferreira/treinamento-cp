/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/task'],
  function (task) {
    /**
     * Function definition to be triggered after record is submitted.
     *
     * @param {Object} context
     * @param {Record} context.newRecord - New record
     * @param {Record} context.oldRecord - Old record
     * @param {string} context.type - Trigger type
     */
    function afterSubmit(context) {

      var mrTask = task.create({
        taskType: task.TaskType.SCHEDULED_SCRIPT,
        scriptId: 'customscript_scheduledcp',
        params: {
          custscript_customer_id: context.newRecord.id
        }
      })

      mrTask.submit()
    }

    return {
      afterSubmit: afterSubmit
    }
  })
