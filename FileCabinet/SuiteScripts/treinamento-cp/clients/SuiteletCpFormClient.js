/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/url'],
  function (currentRecord, url) {
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.mode - The mode in which the record is being accessed (create, copy, or edit)
     */
    function pageInit (context) {}

    function aplicarFiltros () {
      const form = currentRecord.get()
      const subsidiaryId = form.getValue({ fieldId: 'custpage_subsidiary' })

      var suiteletUrl = url.resolveScript({
        scriptId: 'customscript_suiteletcpform',
        deploymentId: 'customdeploy_suiteletcpform',
        params: {
          custpage_subsidiary: subsidiaryId
        }
      })

      window.onbeforeunload = function () {}
      window.location.replace(suiteletUrl)
    }

    return {
      pageInit: pageInit,
      aplicarFiltros: aplicarFiltros
    }
  })
