/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record', 'N/error', 'N/runtime'],
	function (search, record, error, runtime) {

	    /**
	     * Function called upon sending a GET request to the RESTlet.
	     *
	     * @param {Object} requestParams - Parameters from HTTP request URL; parameters will be passed into function as an Object (for all supported content types)
	     * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
	     * @since 2015.1
	     */
	    function doGet (requestParams) {
        const customerId = requestParams.customerId

        if (!customerId) {
          // throw error.create({
          //   name: 'CP_INVALID_CUSTOMER_ID',
          //   // message: 'Invalid customer ID: ' + customerId,
          //   message: `Invalid customer ID: ${customerId}`,
          //   notifyOff: true
          // })

          return search.create({
            type: search.Type.CUSTOMER,
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
            .map(function (result) {
              const columns = result.columns
              return {
                id: result.id,
                isperson: result.getValue(columns[0]),
                firstname: result.getValue(columns[1]),
                lastname: result.getValue(columns[2]),
                companyname: result.getValue(columns[3])
              }
            })
        }

        const customerColumns = [
          'isperson',
          'firstname',
          'lastname',
          'companyname'
        ]

        const customerValues = search.lookupFields({
          type: search.Type.CUSTOMER,
          id: customerId,
          columns: customerColumns
        })

	      return {
          id: customerId,
          isperson: customerValues[customerColumns[0]],
          firstname: customerValues[customerColumns[1]],
          lastname: customerValues[customerColumns[2]],
          companyname: customerValues[customerColumns[3]]
        }
	    }

	    /**
	     * Function called upon sending a POST request to the RESTlet.
	     *
	     * @param {string | Object} requestBody - The HTTP request body; request body will be passed into function as a string when request Content-Type is 'text/plain'
	     * or parsed into an Object when request Content-Type is 'application/json' (in which case the body must be a valid JSON)
	     * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
	     * @since 2015.2
	     */
	    function doPost (requestBody) {
	      const customer = record.create({ type: record.Type.CUSTOMER })
        const isPerson = requestBody.isperson

        customer.setValue({ fieldId: 'isperson', value: isPerson })

        if (isPerson === 'T') {
          customer.setValue({ fieldId: 'firstname', value: requestBody.firstname })
          customer.setValue({ fieldId: 'lastname', value: requestBody.lastname })
        } else {
          customer.setValue({ fieldId: 'companyname', value: requestBody.companyname })
        }

        const customerId = customer.save({ ignoreMandatoryFields: true })

        return {
          message: 'Cliente salvo com sucesso',
          data: {
            id: customerId
          }
        }
	    }

	    /**
	     * Function called upon sending a PUT request to the RESTlet.
	     *
	     * @param {string | Object} requestBody - The HTTP request body; request body will be passed into function as a string when request Content-Type is 'text/plain'
	     * or parsed into an Object when request Content-Type is 'application/json' (in which case the body must be a valid JSON)
	     * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
	     * @since 2015.2
	     */
	    function doPut(requestBody) {
        const customerId = requestBody.id

        record.submitFields({
          type: record.Type.CUSTOMER,
          id: customerId,
          values: {
            firstname: requestBody.firstname,
            lastname: requestBody.lastname
          }
        })

        return {
          message: 'Cliente atualizado com sucesso',
          data: {
            id: customerId
          }
        }
	    }

	    /**
	     * Function called upon sending a DELETE request to the RESTlet.
	     *
	     * @param {Object} requestParams - Parameters from HTTP request URL; parameters will be passed into function as an Object (for all supported content types)
	     * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
	     * @since 2015.2
	     */
	    function doDelete (requestParams) {
        const customerId = requestParams.customerId

        record.delete({
          type: record.Type.CUSTOMER,
          id: customerId
        })

        return {
          message: 'Cliente excluído com sucesso'
        }
	    }

	    return {
	        'get': doGet,
	        'post': doPost,
	        'put': doPut,
	        'delete': doDelete
	    };

	});
