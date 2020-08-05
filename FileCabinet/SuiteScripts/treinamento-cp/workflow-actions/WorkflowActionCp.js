/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/search', 'N/record'],
  function (search, record) {

    /**
     * On action.
     *
     * @param context
     */
    function onAction (context) {
      const newRecord = context.newRecord
      const clienteNetsuiteId = newRecord.getValue({ fieldId: 'custrecord_cliente_netsuite' })

      if (clienteNetsuiteId) {
        record.submitFields({
          typw: record.Type.CUSTOMER,
          id: clienteNetsuiteId,
          values: {
            custentity_status_aprovacao: newRecord.getValue({ fieldId: 'custrecord_status_aprov' })
          }
        })
      }

      // return 'Cliente NetSuite atualizado com sucesso!'

      return search.create({
        type: 'customrecord_cliente'
      })
        .runPaged()
        .count
    }

    return {
      onAction: onAction
    }
  });
