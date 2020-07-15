/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/ui/dialog', '../third/vanilla-masker.min.js', 'N/currentRecord', 'N/ui/message', 'N/https', 'N/url'],
  function (dialog, VMasker, currentRecord, message, https, url) {
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.mode - The mode in which the record is being accessed (create, copy, or edit)
     */
    function pageInit (context) {
      // debugger;
      // alert('mode: ' + mode);
      // console.log('mode: ' + mode);
      VMasker(document.querySelector('#phone')).maskPattern('(99) 9999-9999');
    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.sublistId - Sublist name
     * @param {string} context.fieldId - Field name
     * @param {number} context.line - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} context.column - Line number. Will be undefined if not a matrix field
     */
    function fieldChanged (context) {
      const currentRecord = context.currentRecord
      const fieldId = context.fieldId
      const sublistId = context.sublistId

      // var valor = ''
      //
      // if (sublistId) {
      //   valor = currentRecord.getCurrentSublistValue({
      //     sublistId: sublistId,
      //     fieldId: fieldId
      //   });
      // } else {
      //   valor = currentRecord.getValue({ fieldId: fieldId })
      // }
      //
      // console.log(
      //   'sublist: ' + context.sublistId +
      //   ' linha: ' + context.line +
      //   ' campo: ' + fieldId + ' valor: ' + valor);

      if (fieldId === 'firstname') {
        const firstName = currentRecord.getValue({ fieldId: fieldId })

        if (firstName) {
          currentRecord.setValue({ fieldId: 'phone', value: '9999999999', ignoreFieldChange: true })
        }
      }

      if (fieldId === 'entity') {
        console.log('sub no fieldchanged ' + currentRecord.getValue({ fieldId: 'subsidiary' }))
      }
    }

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.sublistId - Sublist name
     * @param {string} context.fieldId - Field name
     */
    function postSourcing(context) {
      const currentRecord = context.currentRecord
      const fieldId = context.fieldId

      if (fieldId === 'entity') {
        console.log('sub no post ' + currentRecord.getValue({ fieldId: 'subsidiary' }))
      }
    }

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.sublistId - Sublist name
     */
    function sublistChanged(context) {

    }

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.sublistId - Sublist name
     */
    function lineInit(context) {

    }

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.sublistId - Sublist name
     * @param {string} context.fieldId - Field name
     * @param {number} context.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} context.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     */
    function validateField(context) {
      const currentRecord = context.currentRecord
      const fieldId = context.fieldId

      if (fieldId === 'firstname') {
        const firstName = currentRecord.getValue({ fieldId: fieldId })

        if (firstName.length < 10) {
          // alert('nome menor que 10');
          // return false;
        }
      }

      return true;
    }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     */
    function validateLine(context) {

      return true;
    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     */
    function validateInsert(context) {

    }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     */
    function validateDelete(context) {

    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     */
    function saveRecord(context) {
      const currentRecord = context.currentRecord
      const firstName = currentRecord.getValue({ fieldId: 'firstname' })

      if (firstName.length < 10) {
        dialog.alert({
          title: 'I am an Alert',
          message: 'nome menor que 10.'
        })
        return false;
      }

      var objRecord = record.load({
        type: record.Type.SALES_ORDER,
        id: 157,
        isDynamic: true,
      });

      objRecord.save();

      var suiteletUrl = url.resolveScript({
        scriptId: 'customscript_suiteletcp',
        deploymentId: 'customdeploy_suiteletcp',
        params: {
          invoiceId: '999'
        }
      })

      // Sincrona
      const res = https.get({
        url: suiteletUrl
      })

      const invoiceInfo = JSON.parse(res.body)

      invoiceInfo.id
      invoiceInfo.entity
      invoiceInfo.date

      if (invoice.id) {
        alert('tem invoice ID')
        return false
      }

      // Assincrona
      https.get.promise({
        url: suiteletUrl
      })
        .then(function (res) {
          const invoiceInfo = JSON.parse(res.body)

          invoiceInfo.id
          invoiceInfo.entity
          invoiceInfo.date

        })
        .catch(function () {

        })

      return true;
    }

    function myExecute () {
      const employee = currentRecord.get()

      dialog.alert({
        title: 'I am an Alert',
        message: 'Função execute.' + employee.getValue({ fieldId: 'firstname' })
      })
    }

    function print () {
      message.create({
        title: "My Title",
        message: "My Message",
        type: message.Type.CONFIRMATION
      })
        .show()
    }

    return {
      pageInit: pageInit,
      fieldChanged: fieldChanged,
      postSourcing: postSourcing,
      sublistChanged: sublistChanged,
      lineInit: lineInit,
      validateField: validateField,
      // validateLine: validateLine,
      // validateInsert: validateInsert,
      // validateDelete: validateDelete,
      saveRecord: saveRecord,
      myExecute: myExecute,
      print: print
    }
  })
