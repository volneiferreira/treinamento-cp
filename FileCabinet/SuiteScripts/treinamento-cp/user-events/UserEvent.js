/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget', 'N/redirect', 'N/record', 'N/error', 'N/search'],
  function (serverWidget, redirect, record, error, search) {
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} context
     * @param {Record} context.newRecord - New record
     * @param {string} context.type - Trigger type
     * @param {Form} context.form - Current form
     */
    function beforeLoad(context) {
      if (context.type !== context.UserEventType.VIEW) return

      log.debug({ title: 'parameters', details: context.request.parameters })

      const form = context.form

      form.clientScriptModulePath = '../clients/Client.js'

      form.addButton({
        id: 'custpage_imprimir',
        label: 'Imprimir',
        functionName: "(function(){window.open('" + 'www.google.com.br' + "', '_self')})"
      })

      form.addField({
        type: serverWidget.FieldType.INLINEHTML,
        id: 'custpage_exemplo',
        label: 'Exemplo'
      })
        .defaultValue = '<p style="color: red">teste</p>'

      form.addField({
        type: serverWidget.FieldType.LONGTEXT,
        id: 'custpage_dados',
        label: 'Dados'
      })
        .updateDisplayType({
          displayType: serverWidget.FieldDisplayType.HIDDEN
        })
        .defaultValue = JSON.stringify({
          name: 'exemplo'
        })

      // redirect.toRecord({
      //   type: record.Type.CUSTOMER,
      //   id: 4075
      // });
    }

    /**
     * Function definition to be triggered before record is submitted.
     *
     * @param {Object} context
     * @param {Record} context.newRecord - New record
     * @param {Record} context.oldRecord - Old record
     * @param {string} context.type - Trigger type
     */
    function beforeSubmit(context) {
      if (context.type === context.UserEventType.DELETE) {
        // exclui registros filhos.
      } else {
        const newRecord = context.newRecord
        const exemplo = newRecord.getValue({ fieldId: 'custpage_exemplo' })
        newRecord.setValue({ fieldId: 'custentity_exemplo', value: exemplo })
      }

      // throw 'Aconteceu algum erro'

      // throw new Error('Aconteceu algum erro')

      // throw error.create({
      //   name: 'MY_ERROR_CODE',
      //   message: 'my custom error details',
      //   notifyOff: true
      // })
    }

    /**
     * Function definition to be triggered after record is submitted.
     *
     * @param {Object} context
     * @param {Record} context.newRecord - New record
     * @param {Record} context.oldRecord - Old record
     * @param {string} context.type - Trigger type
     */
    function afterSubmit(context) {
      const contratosCount = search.create({
        type: 'customrecord_contrato',
        filters: [{
          name: 'custrecord_employee',
          operator: 'anyof',
          values: context.newRecord.id
        }]
      })
        .run()
        .getRange({
          start: 0,
          end: 1
        })
        .length

      if (contratosCount !== 0) return

      const contrato = record.create({ type: 'customrecord_contrato' })
      contrato.setValue({ fieldId: 'custrecord_employee', value: context.newRecord.id })
      contrato.save({ ignoreMandatoryFields: true })
    }

    return {
      beforeLoad: beforeLoad,
      beforeSubmit: beforeSubmit,
      afterSubmit: afterSubmit
    }
  })
