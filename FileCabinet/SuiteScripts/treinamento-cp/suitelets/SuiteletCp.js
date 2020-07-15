/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define([],
  function () {
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     */
    function onRequest (context) {
      const request = context.request
      const method = request.method
      const parameters = request.parameters

      if (method === 'GET') {
        log.debug({ title: 'parameters', details: parameters })

        const invoiceId = parameters.invoiceId

        // context.response.write({
        //   output: 'invoiceId ' + invoiceId
        // })

        // context.response.write({
        //   output: '<html><header></header><body><span style="color: red">Olá mundo!</span></body></html>'
        // })

        context.response.write({
          output: JSON.stringify({
            id: invoiceId,
            entity: 'Fulano',
            date: '15/07/2020'
          })
        })

      } else { // POST

      }
    }

    return {
      onRequest: onRequest
    }
  })
