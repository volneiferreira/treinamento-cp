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
	      const order = record.create({ type: record.Type.SALES_ORDER, isDynamic: true })

        order.setValue({ fieldId: 'entity', value: '123' })
        order.setValue({ fieldId: 'job', value: '456' })

        order.selectNewLine({ sublistId: 'item' })
        order.setCurrentLineItemValue({ sublistId: 'item', fieldId: 'item', value: '1' })
        order.commitLine({ sublistId: 'item' })

        order.selectNewLine({ sublistId: 'item' })
        order.setCurrentLineItemValue({ sublistId: 'item', fieldId: 'item', value: '2' })
        order.commitLine({ sublistId: 'item' })

        const itemCount = order.getLineCount({ sublistId: 'item' })

        for (var line = 0; line < itemCount; line++) {
          order.selectLine({ sublistId: 'item', line: line })
          order.setCurrentLineItemValue({ sublistId: 'item', fieldId: 'quantity', value: 3 })
          order.commitLine({ sublistId: 'item' })
        }

        order.save({ ignoreMandatoryFields: true })
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

	    }

	    /**
	     * Function called upon sending a DELETE request to the RESTlet.
	     *
	     * @param {Object} requestParams - Parameters from HTTP request URL; parameters will be passed into function as an Object (for all supported content types)
	     * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
	     * @since 2015.2
	     */
	    function doDelete (requestParams) {

	    }

	    return {
	        'get': doGet,
	        'post': doPost,
	        'put': doPut,
	        'delete': doDelete
	    };

	});
