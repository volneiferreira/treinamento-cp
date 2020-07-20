/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/runtime', 'N/record', 'N/email'],
  function (search, runtime, record, email) {

    /**
     * Columns to be retrieved in the search.
     *
     * @type {object[]}
     */
    const searchColumns = [{
      name: 'isperson'
    }, {
      name: 'firstname'
    }, {
      name: 'lastname'
    }, {
      name: 'companyname'
    }, {
      name: 'category'
    }]

    /**
     * Columns to be retrieved in the results.
     *
     * @type {string[]}
     */
    const resultColumns = searchColumns.map(function (c) {
      var column = c.name + (c.join ? '.' + c.join : '')
      if (c.summary) {
        column = c.summary + '(' + column + ')'
      }
      return column
    })

    /**
     * Marks the beginning of the Map/Reduce process and generates input data.
     *
     * @typedef {Object} ObjectRef
     * @property {number} id - Internal ID of the record instance
     * @property {string} type - Record type id
     *
     * @return {Array|Object|Search|RecordRef} inputSummary
     * @since 2015.1
     */
    function getInputData() {

      /* var scriptObj = runtime.getCurrentScript();
      var processId = scriptObj.getParameter({ name: 'custscript_id_processo' });

      record.submitFields({
        type: 'customrecord_processo',
        id: processId,
        values: {
          custrecord_status: 'PROCESSANDO'
        }
      }) */

      return search.create({
        type: search.Type.CUSTOMER,
        /* filters: [{
          name: 'custentity_processado',
          operator: search.Operator.IS,
          value: false
        }],*/
        columns: searchColumns
      })
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
      const result = JSON.parse(context.value)
      log.debug({ title: 'result', details: result })

      const isPerson = result.values.isperson
      // const isPerson = result.values[resultColumns[0]]

      // result.values['name.subsidiary']
      // const categoryId = result.values.category.value
      // result.values.category.text
      //
      // {
      //   "recordType": "customer",
      //   "id": "1228",
      //   "values": {
      //     "isperson": "F",
      //     "firstname": "",
      //     "lastname": "",
      //     "companyname": "鈴木商事"
      //   }
      // }

      context.write({
        key: isPerson,
        value: {
          customerId: result.id
        }
      })
    }

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    function reduce(context) {
      log.debug({ title: 'isPerson: ' + context.key, details: context.values })

      context.values.forEach(function (customer) {
        // Handle customerId
        customer.customerId
      })

      context.write({
        key: context.key,
        value: context.values.length
      })
    }

    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {

      const inputSummaryError = summary.inputSummary.error

      if (inputSummaryError) {
        log.error({ title: 'Input Error', details: inputSummaryError })
      }

      summary.mapSummary.errors.iterator().each(function (key, error) {
        log.error({ title: 'Map Error for key: ' + key, details: error })
        return true
      })

      summary.reduceSummary.errors.iterator().each(function (key, error) {
        log.error({ title: 'Reduce Error for key: ' + key, details: error })
        return true
      })

      var clientesPFAtualizados = 0
      var clientesPJAtualizados = 0

      summary.output.iterator().each(function (key, value) {
        if (key === 'T') {
          clientesPFAtualizados += parseInt(value, 10)
        } else {
          clientesPJAtualizados += parseInt(value, 10)
        }
        return true
      })

      var scriptObj = runtime.getCurrentScript();
      var processId = scriptObj.getParameter({ name: 'custscript_id_processo' });

      record.submitFields({
        type: 'customrecord_processo',
        id: processId,
        values: {
          custrecord_status: 'CONCLUIDO',
          custrecord_clientes_pf_atualizados: clientesPFAtualizados,
          custrecord_clientes_pj_atualizados: clientesPJAtualizados,
        }
      })

      email.send({
        author: -5,
        recipients: 12,
        subject: 'Processo MAP/REDUCE finalizado',
        body: 'email body'
      })
    }

    return {
      getInputData: getInputData,
      map: map,
      reduce: reduce,
      summarize: summarize
    }
  })
