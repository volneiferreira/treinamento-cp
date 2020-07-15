/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget', 'N/search'],
  function (serverWidget, search) {
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     */
    function onRequest(context) {
      const request = context.request
      const method = request.method
      const parameters = request.parameters

      var form = serverWidget.createForm({ title: 'Simple Form' });

      if (method === 'GET') {
        form.clientScriptModulePath = '../clients/SuiteletCpFormClient.js'

        form.addButton({
          id: 'custpage_aplicar_filtros',
          label: 'Aplicar filtros',
          functionName: 'aplicarFiltros'
        })

        form.addFieldGroup({
          id: 'filtros',
          label: 'Filtros'
        })

        const subsidiaryField = form.addField({
          type: serverWidget.FieldType.SELECT,
          id: 'custpage_subsidiary',
          label: 'Subsidiária',
          source: 'subsidiary',
          container: 'filtros',
        })

        const subsidiaryId = parameters.custpage_subsidiary

        subsidiaryField.defaultValue = subsidiaryId

        const sublistClientes = form.addSublist({
          id: 'custpage_clientes',
          type: serverWidget.SublistType.LIST,
          label: 'Clientes'
        })

        sublistClientes.addMarkAllButtons()
        sublistClientes.addRefreshButton()

        sublistClientes.addField({
          id: 'custpage_cliente_selecionado',
          type: serverWidget.FieldType.CHECKBOX,
          label: 'Selecionar'
        })

        sublistClientes.addField({
          id: 'custpage_cliente_nome',
          type: serverWidget.FieldType.TEXT,
          label: 'Nome'
        })

        const filtros = []

        if (subsidiaryId) {
          filtros.push({
            name: 'subsidiary',
            operator: search.Operator.ANYOF,
            values: subsidiaryId
          })
        }

        const buscaCliente = search.create({
          type: search.Type.CUSTOMER,
          filters: filtros.length ? filtros : undefined,
          columns: [{
            name: 'entityid'
          }]
        })

        const setClientes = buscaCliente.run()

        // limite 1000
        const arrayClientes = setClientes.getRange({ start: 0, end: 1000 })

        arrayClientes.forEach(function (result, index) {
          sublistClientes.setSublistValue({
            id: 'custpage_cliente_nome',
            line: index,
            value: result.getValue(result.columns[0])
          })
        })

        // var line = 0
        //
        // // limite de 4000 resultados
        // setClientes.each(function (result) {
        //   sublistClientes.setSublistValue({
        //     id: 'custpage_cliente_nome',
        //     line: line,
        //     value: result.getValue(result.columns[0])
        //   })
        //   line++
        //   return true
        // })

        // sem limites*
        // var myPagedData = buscaCliente.runPaged({
        //   pageSize: 1000
        // });
        //
        // myPagedData.pageRanges.forEach(function (pageRange) {
        //
        //   var myPage = myPagedData.fetch({ index: pageRange.index });
        //
        //   myPage.data.forEach(function (result) {
        //     sublistClientes.setSublistValue({
        //       id: 'custpage_cliente_nome',
        //       line: index,
        //       value: result.getValue(result.columns[0])
        //     })
        //   });
        //
        // });

        form.addSubmitButton({
          label: 'Enviar p/ o POST'
        })

      } else { // POST
        log.debug({ title: 'parameters POST', details: parameters })

        const countClientes = request.getLineCount({ group: 'custpage_clientes' });
        const clientesSelecionados = []

        for (var line = 0; line < countClientes; line++) {

          var selecionado = request.getSublistValue({
            group: 'custpage_clientes',
            name: 'custpage_cliente_selecionado',
            line: line
          })

          if (selecionado === 'T') {
            clientesSelecionados.push(request.getSublistValue({
              group: 'custpage_clientes',
              name: 'custpage_cliente_nome',
              line: line
            }))
          }
        }

        log.debug({ title: 'clientesSelecionados', details: clientesSelecionados })

        // Atualiza registros, envia email

        form.addField({
          type: serverWidget.FieldType.INLINEHTML,
          id: 'custpage_mensagem_sucesso',
          label: 'Sucesso'
        })
          .defaultValue = '<p style="color: green">Dados salvos com sucesso!</p>'
      }

      context.response.writePage({
        pageObject: form
      })
    }

    return {
      onRequest: onRequest
    }
  })
