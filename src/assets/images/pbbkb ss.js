/**
   *@NApiVersion 2.x
   *@NScriptType ScheduledScript
   */
define(['N/runtime', 'N/search', 'N/record', 'N/email', 'N/format', 'N/task'],
       function(runtime, search, record, email, format ,task ) {
  var moment;
  function parseDate(s) {
    var months = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,
                  jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
    var p = s.split('-');
    return new Date(p[2], months[p[1].toLowerCase()], p[0]);
  }

  function findItemOat(id){
    var itemOat = ""
    if(id!=""&&id!=null){
      var itemOat = search.create({
        type: 'itemfulfillment',
        filters: [
          {name:'internalid',operator: search.Operator.IS,values: id},
          {name:'custitem_tem_item_type',join:'item',operator: search.Operator.IS,values: 2},
        ],
        columns: [
          'item'
        ]
      }).run().getRange(0, 1);
    }
    if(itemOat.length>0){
      itemOat = itemOat[0].getValue('item')
    }
    return itemOat
  }

  function ttcProccess(period){

    try{

      log.audit({
        "title": "Remaining Usage: START",
        "details": runtime.getCurrentScript().getRemainingUsage()
      });
      var invoiceResult = search.load({
        id: 'customsearch_tem_invoice_ttc_stc',
        columns: [
          {name:'custbody_tem_ace_number'},
          {name:'custbody_tem_invoice_linked'},
          {name:'entity'},
          {name:'tranid'},
          {name:'item'},
          {name:'department'},
          {name:'shipaddress'},
          {name:'custcol_tem_qty_ship'},
          {name:'custbody_tem_vendor_oat'},
          {name:'custbody_tem_pack_date'},
          {name:'rate',join:'CUSTBODY_TEM_INVOICE_LINKED'},
          {name:'item',join:'CUSTBODY_TEM_NO_PO_ANGKUTAN'},
          {name:'city',join:'shippingAddress'},
          {name:'custentity_tem_persentase_pbbkb',join:'customer'},
          {name:'custentity_tem_pbbkb_hrgbeli_flag',join:'customer'},
          {name:'custbody_tem_delivery_type',join:'createdFrom'},
          {name:'custcol_tem_line_assist'},
          {name:'custbody_tem_linked_inv_pbbkb',join:'custbody_tem_invoice_linked'},
          {name:'custentity_tem_rate_include_pbbkb',join:'customer'},
          {name:'custbody_tem_fulfill_linked'}
        ]
      });

      invoiceResult.filters.push(search.createFilter({
        name: 'formulanumeric',
        formula: "NVL({quantity},0)-NVL({custcol_tem_flag_pbbkb_trx},0)",
        operator: search.Operator.GREATERTHAN,
        values: 0
      }));
      if(period){
        invoiceResult.filters.push(search.createFilter({
          name: 'trandate',
          join: 'custbody_tem_invoice_linked',
          operator: search.Operator.ONORBEFORE,
          values: format.format({value:period, type: format.Type.DATE})
        }));
      }
      invoiceResult = invoiceResult.run().getRange(0, 1000);
      for(var idx in invoiceResult){
        var acenum = invoiceResult[idx].getValue({ name: "custbody_tem_ace_number"})
        var linkId = invoiceResult[idx].getValue({name:'custcol_tem_line_assist'})
        var invoiceLinked = invoiceResult[idx].getValue({ name: "custbody_tem_invoice_linked"})
        var entity = invoiceResult[idx].getValue({ name: "entity"})
        var item = invoiceResult[idx].getValue({ name: "item"})
        var locationnohierarchy = invoiceResult[idx].getValue({ name: "locationnohierarchy"})
        var rate = invoiceResult[idx].getValue({name:'rate',join:'CUSTBODY_TEM_INVOICE_LINKED'})
        var department = invoiceResult[idx].getValue({name:'department'})
        var quantity = invoiceResult[idx].getValue({name:'quantity'})
        var packDate = invoiceResult[idx].getValue({name:'custbody_tem_pack_date'})
        var qtyShip = invoiceResult[idx].getValue({name:'custcol_tem_qty_ship'})
        var shipaddress = invoiceResult[idx].getValue({name:'shipaddress'})
        var tranId = invoiceResult[idx].getValue({name:'tranid'})
        var vendorOat = invoiceResult[idx].getValue({name:'custbody_tem_vendor_oat'})
        var city = invoiceResult[idx].getValue({name:'city',join:'shippingAddress'})
        var noPoAngkutan = invoiceResult[idx].getValue({name:'custbody_tem_no_po_angkutan'})
        var persentasePbbkb = invoiceResult[idx].getValue({name:'custentity_tem_persentase_pbbkb',join:'customer'})
        var flagHargaBeliPbbkb = invoiceResult[idx].getValue({name:'custentity_tem_pbbkb_hrgbeli_flag',join:'customer'})
        var deliveryType = invoiceResult[idx].getValue({name:'custbody_tem_delivery_type',join:'createdFrom'})
        var itemPo = invoiceResult[idx].getValue({name:'item',join:'CUSTBODY_TEM_NO_PO_ANGKUTAN'})
        var invFlagId = invoiceResult[idx].getValue({name:'custbody_tem_linked_inv_pbbkb',join:'custbody_tem_invoice_linked'})
        var rateInclude = invoiceResult[idx].getValue({name:'custentity_tem_rate_include_pbbkb',join:'customer'})
        var idFulfillLinked = invoiceResult[idx].getValue({name:'custbody_tem_fulfill_linked'})
        if(qtyShip==""||qtyShip==null){
          qtyShip = quantity
        }
        if(rateInclude==""||rateInclude==null){
          rateInclude = false
        }
        var id = invoiceResult[idx].id
        if(itemPo==""||itemPo==null){
          itemPo = findItemOat(id)
          if(itemPo==""||itemPo==null){
            itemPo = findItemOat(idFulfillLinked)
          }
        }
        packDate = format.parse({value:packDate, type: format.Type.DATE})
        var receiveResult = search.load({
          id: 'customsearch_tem_receive_hsd_ttc_s',
          columns: [
            {name:'trandate'},
            {name:'rate'},
            {name:'custbody_tem_ace_number'},
            {name:'quantity'},
          ]
        })

        //receiveResult.filters.push(search.createFilter({
        // name: 'formulanumeric',
        //formula: "NVL({quantity},0)-NVL({custcol_tem_flag_pbbkb_trx},0)",
        //operator: search.Operator.GREATERTHAN,
        //values: 0
        //}));
        
        if(acenum==""||acenum==null){
          log.error('Error', 'receiveAcenum Not Found')
          var errorRecord = record.create({
            type : "customrecord_tem_log_error_pbbkb",
            isDynamic : true
          });

          errorRecord.setValue('custrecord_tem_log_inv_no',invoiceLinked);
          errorRecord.setValue('custrecord_tem_log_do_num',id);
          errorRecord.setValue('custrecord_tem_log_error',"Ace Number DO null " );
          errorRecord.save();
          continue;
        }else {
          receiveResult.filters.push(search.createFilter({
          name: 'custbody_tem_ace_number',
          operator: search.Operator.IS,
          values: acenum
          }));
          receiveResult = receiveResult.run().getRange(0, 1);
          if(receiveResult.length==0){
            var errorRecord = record.create({
              type : "customrecord_tem_log_error_pbbkb",
              isDynamic : true
            });

            errorRecord.setValue('custrecord_tem_log_inv_no',invoiceLinked);
            errorRecord.setValue('custrecord_tem_log_do_num',id);
            errorRecord.setValue('custrecord_tem_log_error',"Ace Number Not Found " + tranId);
            errorRecord.save();
            continue;
          }
        }
        for(var idx in receiveResult){
          var irDate = receiveResult[idx].getValue({name:'trandate'})
          var poRate = receiveResult[idx].getValue({name:'rate'})
          var receiveAcenum = receiveResult[idx].getValue({name:'custbody_tem_ace_number'})
          var receiveQty = receiveResult[idx].getValue({name:'quantity'})
          var number = receiveResult[idx].id
          if(flagHargaBeliPbbkb){
            var price = (parseFloat(poRate)*parseFloat(persentasePbbkb))/100;
          }else{
            if(rateInclude){
              var price = (parseFloat(rate)/((parseFloat(persentasePbbkb)/100)+1))*(parseFloat(persentasePbbkb)/100);
            }else{
              price = (parseFloat(rate)*(parseFloat(persentasePbbkb)/100))
              rateInclude = false
            }
          }
          if(receiveAcenum==acenum){
            try{
              log.audit("insert pbbkb",invoiceLinked+":"+acenum);
            var pbbkbRecord = record.create({
              type : "customrecord_tem_form_pbbkb",
              isDynamic : true
            });

            //set the values in the required fields in JE main section
            pbbkbRecord.setValue('custrecord_tem_pbbkb_acenum',acenum);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_no_inv',invoiceLinked);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_customer',entity);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_sales_cc',department);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_do_num',id);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_item',item);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_qty',quantity);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_ship_from',locationnohierarchy);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_ship_to',shipaddress);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_kabupaten',city);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_invoice_rate',rate);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_po_num',noPoAngkutan);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_price',price);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_ir_date',format.parse({value:irDate, type: format.Type.DATE}));
            pbbkbRecord.setValue('custrecord_tem_pbbkb_po_rate',poRate);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_ir_num',number);
            pbbkbRecord.setValue('custrecord_tem_rate_include_pbbkb_form',rateInclude);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_amount',Math.round(price*quantity));
            pbbkbRecord.setValue('custrecord_tem_pbbkb_rate_percentage',parseFloat(persentasePbbkb));
            pbbkbRecord.setValue('custrecord_tem_pbbkb_flag_beli',flagHargaBeliPbbkb);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_qty_pack',qtyShip);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_vendor_oat',vendorOat);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_item_oat',itemPo);
            pbbkbRecord.setValue('custrecord_tem_delivery_type',deliveryType);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_line_id',linkId);
            pbbkbRecord.setValue('custrecord_tem_je_pbbkb',invFlagId);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_lineid_ir',0);

            if(packDate){
              pbbkbRecord.setValue('custrecord_tem_pbbkb_dopack_date',format.parse({value:packDate, type: format.Type.DATE}));
            }
            pbbkbRecord.save();
            if(pbbkbRecord.id>0){
              var recDo = record.load({
                type: 'itemfulfillment',
                id: id,
                isDynamic: false
              });
              var lineNumber = recDo.findSublistLineWithValue({
                sublistId: 'item',
                fieldId: 'custcol_tem_line_assist',
                value: linkId
              });
              log.audit('lineNumber-'+id,lineNumber)
              recDo.setSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_tem_flag_pbbkb_trx',
                value: quantity,
                line: lineNumber
              });
              recDo.save()
              
            }
            }catch(e){
              log.error("ERROR insert PBBKB",e);
              var errorRecord = record.create({
                type : "customrecord_tem_log_error_pbbkb",
                isDynamic : true
              });

              errorRecord.setValue('custrecord_tem_log_inv_no',invoiceLinked);
              errorRecord.setValue('custrecord_tem_log_do_num',id);
              errorRecord.setValue('custrecord_tem_log_error',e.toString());
              errorRecord.save();
              break;
            }
          }
          
        }//end for receiveResult
         if (runtime.getCurrentScript().getRemainingUsage() < 100) {
           var taskId = rescheduleCurrentScriptTTC();
           //log.audit("Rescheduling status: " + task.checkStatus(taskId));
           return;
         }
      }//end for invoiceResult
      log.audit({
        "title": "Remaining Usage: End TTC Process",
        "details": runtime.getCurrentScript().getRemainingUsage()
      });
    }catch(e){
      log.error("ERROR",e)
    }
  }

  function nonttc(period){
    try{

      log.audit({
        "title": "Remaining Usage: START Non TTC",
        "details": runtime.getCurrentScript().getRemainingUsage()
      });

      var opbalResult = search.create({
        type: 'customrecord_tem_opbal_pbbkb_receipt',
        columns: [
          'custrecord_tem_pbbkb_ace_number',
          'custrecord_tem_opbal_ir_qty',
          'custrecord_tem_opbal_rate',
          'custrecord_tem_qty_out_pbbkb'
        ]
      }).run().getRange(0, 1);
      for(var idx in opbalResult){
        var aceNumberOpbal = opbalResult[idx].getValue({name:'custrecord_tem_pbbkb_ace_number'})
        var qtyOpbal = opbalResult[idx].getValue({name:'custrecord_tem_opbal_ir_qty'})
        var qtyOriOpbal = opbalResult[idx].getValue({name:'custrecord_tem_opbal_ir_qty'})
        var rateOpbal = opbalResult[idx].getValue({name:'custrecord_tem_opbal_rate'})
        var qtyOut = opbalResult[idx].getValue({name:'custrecord_tem_qty_out_pbbkb'});
      }
      if(qtyOut==""){
        qtyOut = 0
        log.audit('test',qtyOut)
      }
      // Sisa
      qtyOpbal = qtyOpbal - qtyOut
      var qtyRcvSisa = 0
      var qtyOutRcv = 0
      var receiveResult = search.load({
        id: 'customsearch_tem_receive_hsd_std',
        filters: [],
        columns: [
          {name:'trandate'},
          {name:'rate'},
          {name:'custbody_tem_ace_number'},
          {name:'custbody_tem_inventory_receipt_numbe'},
          {name:'custcol_tem_flag_pbbkb_trx'},
          {name:'line'}

        ]
      });

      receiveResult.filters.push(search.createFilter({
        name: 'formulanumeric',
        formula: "NVL({quantity},0)-NVL({custcol_tem_flag_pbbkb_trx},0)",
        operator: search.Operator.GREATERTHAN,
        values: 0
      }));

      receiveResult = receiveResult.run().getRange(0, 50);
      log.audit('lengtreceive',receiveResult.length)

      var invoiceResult = search.load({
        id: 'customsearch_tem_invoice_ttc_stc_2',
        columns: [
          {name:'trandate',join:'CUSTBODY_TEM_INVOICE_LINKED'},
          {name:'custbody_tem_invoice_linked'},
          {name:'custentity_tem_rate_include_pbbkb',join:'customer'},
          {name:'entity'},
          {name:'tranid'},
          {name:'trandate'},
          {name:'custbody_tem_pack_date'},
          {name:'item'},
          {name:'quantity'},
          {name:'custcol_tem_qty_ship'},
          {name:'custcol_tem_qty_losses'},
          {name:'custcol_tem_qty_pack'},
          {name:'rate',join:'CUSTBODY_TEM_INVOICE_LINKED'},
          {name:'locationnohierarchy'},
          {name:'custbody_tem_ace_number'},
          {name:'custbody_tem_no_po_angkutan'},
          {name:'item',join:'CUSTBODY_TEM_NO_PO_ANGKUTAN'},
          {name:'custbody_tem_delivery_type',join:'createdFrom'},
          {name:'custbody_tem_vendor_oat'},
          {name:'custentity_tem_pbbkb_hrgbeli_flag',join:'customer'},
          {name:'custentity_tem_persentase_pbbkb',join:'customer'},
          {name:'city',join:'shippingAddress'},
          {name:'shipaddress'},
          {name:'department'},
          {name:'formulacurrency', formula:"({custbody_tem_invoice_linked.rate}) over (PARTITION BY {custbody_tem_invoice_linked}    ORDER BY {linesequencenumber} )"},
          {name:'custcol_tem_line_assist'},
          {name:'custbody_tem_fulfill_linked'}
        ]
      })

      invoiceResult.filters.push(search.createFilter({
        name: 'formulanumeric',
        formula: "NVL({quantity},0)-NVL({custcol_tem_flag_pbbkb_trx},0)",
        operator: search.Operator.GREATERTHAN,
        values: 0
      }));
      if(period){
        invoiceResult.filters.push(search.createFilter({
          name: 'trandate',
          join: 'custbody_tem_invoice_linked',
          operator: search.Operator.ONORBEFORE,
          values: format.format({value:period, type: format.Type.DATE})
        }));
      }
      invoiceResult = invoiceResult.run().getRange(0, 1000);
      log.audit({
        "title": "test",
        "details": invoiceResult.length
      });
      var lineIn = 0
      for(var idx in invoiceResult){

        log.audit({
          "title": "Remaining Usage",
          "details": runtime.getCurrentScript().getRemainingUsage()
        });

        if (runtime.getCurrentScript().getRemainingUsage() < 100) {
          var taskId = rescheduleCurrentScript(qtyOpbal,qtyOut);
          //log.audit("Rescheduling status: " + task.checkStatus(taskId));
          //break;
          return;
        }
        var trandateLinked = invoiceResult[idx].getValue({name:'trandate',join:'CUSTBODY_TEM_INVOICE_LINKED'})
        var invoiceLinked = invoiceResult[idx].getValue({ name: "custbody_tem_invoice_linked"})
        var entity = invoiceResult[idx].getValue({ name: "entity"})
        var tranid = invoiceResult[idx].getValue({ name: "tranid"})
        var trandate = format.parse({value:invoiceResult[idx].getValue({ name: "trandate"}), type: format.Type.DATE})
        var packDate = invoiceResult[idx].getValue({ name: "custbody_tem_pack_date"})
        var item = invoiceResult[idx].getValue({ name: "item"})
        var quantity = invoiceResult[idx].getValue({name:'quantity'})
        var qtyShip = invoiceResult[idx].getValue({name:'custcol_tem_qty_ship'})
        var qtyLosses = invoiceResult[idx].getValue({name:'custcol_tem_qty_losses'})
        var qtyPack = invoiceResult[idx].getValue({name:'custcol_tem_qty_pack'})
        var rate = invoiceResult[idx].getValue({name:'formulacurrency', formula:"({custbody_tem_invoice_linked.rate}) over (PARTITION BY {custbody_tem_invoice_linked}    ORDER BY {linesequencenumber} )"})
        var locationnohierarchy = invoiceResult[idx].getValue({ name: "locationnohierarchy"})
        var acenumber = invoiceResult[idx].getValue({name:'custbody_tem_ace_number'})
        var noPoAngkutan = invoiceResult[idx].getValue({name:'custbody_tem_no_po_angkutan'})
        var itemPo = invoiceResult[idx].getValue({name:'item',join:'CUSTBODY_TEM_NO_PO_ANGKUTAN'})
        var deliveryType = invoiceResult[idx].getValue({name:'custbody_tem_delivery_type',join:'createdFrom'})
        var vendorOat = invoiceResult[idx].getValue({name:'custbody_tem_vendor_oat'})
        var flagHargaBeliPbbkb = invoiceResult[idx].getValue({name:'custentity_tem_pbbkb_hrgbeli_flag',join:'customer'})
        var rateInclude = invoiceResult[idx].getValue({name:'custentity_tem_rate_include_pbbkb',join:'customer'})
        var persentasePbbkb = invoiceResult[idx].getValue({name:'custentity_tem_persentase_pbbkb',join:'customer'})
        var city = invoiceResult[idx].getValue({name:'city',join:'shippingAddress'})
        var shipaddress = invoiceResult[idx].getValue({name:'shipaddress'})
        var department = invoiceResult[idx].getValue({name:'department'})
        var idFulfillLinked = invoiceResult[idx].getValue({name:'custbody_tem_fulfill_linked'})
        var linkId = invoiceResult[idx].getValue({name:'custcol_tem_line_assist'})
        var id = invoiceResult[idx].id
        var qtyOutTemp = 0
        if(itemPo==""||itemPo==null){
          itemPo = findItemOat(id)
          if(itemPo==""||itemPo==null){
            itemPo = findItemOat(idFulfillLinked)
          }
        }
        if(rateInclude==""||rateInclude==null){
          rateInclude = false
        }
        if(flagHargaBeliPbbkb){
          var price = parseFloat(rateOpbal)*parseFloat(persentasePbbkb)/100;
        }else{
          if(rateInclude){
            var price = (parseFloat(rate)/((parseFloat(persentasePbbkb)/100)+1))*(parseFloat(persentasePbbkb)/100);
          }else{
            price = (parseFloat(rate)*(parseFloat(persentasePbbkb)/100))
            rateInclude = false
          }
        }
        if(qtyPack==""){
          qtyPack = quantity
        }
        if(qtyOpbal>0&&qtyOpbal!=0){
          if(parseFloat(qtyOpbal)>parseFloat(quantity)){
            var pbbkbRecord = record.create({
              type : "customrecord_tem_form_pbbkb",
              isDynamic : true
            });
            //set the values in the required fields in JE main section
            pbbkbRecord.setValue('custrecord_tem_pbbkb_acenum',aceNumberOpbal);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_no_inv',invoiceLinked);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_customer',entity);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_sales_cc',department);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_do_num',id);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_item',item);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_qty',quantity);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_ship_from',locationnohierarchy);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_ship_to',shipaddress);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_kabupaten',city);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_invoice_rate',rate);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_po_num',noPoAngkutan);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_price',price);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_ir_date',format.parse({value:trandate, type: format.Type.DATE}));
            pbbkbRecord.setValue('custrecord_tem_pbbkb_po_rate',rateOpbal);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_amount',Math.round(price*quantity));
            pbbkbRecord.setValue('custrecord_tem_rate_include_pbbkb_form',rateInclude);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_rate_percentage',parseFloat(persentasePbbkb));
            pbbkbRecord.setValue('custrecord_tem_pbbkb_flag_beli',flagHargaBeliPbbkb);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_qty_pack',qtyPack);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_vendor_oat',vendorOat);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_item_oat',itemPo);
            pbbkbRecord.setValue('custrecord_tem_delivery_type',deliveryType);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_line_id',linkId);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_lineid_ir',0);
            if(packDate){
              pbbkbRecord.setValue('custrecord_tem_pbbkb_dopack_date',format.parse({value:packDate, type: format.Type.DATE}));
            }
            pbbkbRecord.save();
            if(pbbkbRecord.id>0){
              qtyOpbal = parseFloat(qtyOpbal) - parseFloat(qtyPack)
              qtyOut = parseFloat(qtyOut) + parseFloat(qtyPack)
              var recDo = record.load({
                type: 'itemfulfillment',
                id: id,
                isDynamic: false
              });
              var lineNumber = recDo.findSublistLineWithValue({
                sublistId: 'item',
                fieldId: 'custcol_tem_line_assist',
                value: linkId
              });
              recDo.setSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_tem_flag_pbbkb_trx',
                value: quantity,
                line: lineNumber
              });
              recDo.save()
              log.audit('qtyOpbal',qtyOpbal)

              if (runtime.getCurrentScript().getRemainingUsage() < 100) {
                var taskId = rescheduleCurrentScript(qtyOpbal,qtyOut);
                //log.audit("Rescheduling status: " + task.checkStatus(taskId));
                //break;
                return;
              }
              record.submitFields({
                "type": "customrecord_tem_opbal_pbbkb_receipt",
                "id": 1,
                "values": {
                  "custrecord_tem_qty_out_pbbkb": qtyOut
                }
              });
            }
          }else if(parseFloat(qtyOpbal)<=parseFloat(quantity)){
            var pbbkbRecord = record.create({
              type : "customrecord_tem_form_pbbkb",
              isDynamic : true
            });
            pbbkbRecord.setValue('custrecord_tem_pbbkb_acenum',aceNumberOpbal);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_no_inv',invoiceLinked);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_customer',entity);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_sales_cc',department);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_do_num',id);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_item',item);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_qty',qtyOpbal);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_ship_from',locationnohierarchy);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_ship_to',shipaddress);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_kabupaten',city);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_invoice_rate',rate);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_po_num',noPoAngkutan);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_price',price);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_ir_date',format.parse({value:trandate, type: format.Type.DATE}));
            pbbkbRecord.setValue('custrecord_tem_pbbkb_po_rate',rateOpbal);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_amount',Math.round(price*qtyOpbal));
            pbbkbRecord.setValue('custrecord_tem_rate_include_pbbkb_form',rateInclude);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_rate_percentage',parseFloat(persentasePbbkb));
            pbbkbRecord.setValue('custrecord_tem_pbbkb_flag_beli',flagHargaBeliPbbkb);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_qty_pack',qtyOpbal);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_vendor_oat',vendorOat);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_item_oat',itemPo);
            pbbkbRecord.setValue('custrecord_tem_delivery_type',deliveryType);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_line_id',linkId);
            pbbkbRecord.setValue('custrecord_tem_pbbkb_lineid_ir',0);
            if(packDate){
              pbbkbRecord.setValue('custrecord_tem_pbbkb_dopack_date',format.parse({value:packDate, type: format.Type.DATE}));
            }
            pbbkbRecord.save();
            if(pbbkbRecord.id>0){
              var qtyPackSisa = qtyPack - qtyOpbal
              var qtySisa = quantity - qtyOpbal
              qtyOut = qtyOriOpbal
              qtyOpbal = 0
            }
            log.debug('qtySisa',qtySisa)
            if(qtySisa==0){
              var recDo = record.load({
                type: 'itemfulfillment',
                id: id,
                isDynamic: false
              });
              var lineNumber = recDo.findSublistLineWithValue({
                sublistId: 'item',
                fieldId: 'custcol_tem_line_assist',
                value: linkId
              });
              recDo.setSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_tem_flag_pbbkb_trx',
                value: quantity,
                line: lineNumber
              });
              recDo.save()
              log.audit('qtyOpbal',qtyOpbal)

              if (runtime.getCurrentScript().getRemainingUsage() < 100) {
                var taskId = rescheduleCurrentScript(qtyOpbal,qtyOut);
                //log.audit("Rescheduling status: " + task.checkStatus(taskId));
                return;
              }
              record.submitFields({
                "type": "customrecord_tem_opbal_pbbkb_receipt",
                "id": 1,
                "values": {
                  "custrecord_tem_qty_out_pbbkb": qtyOut
                }
              });
              continue;
            }

            if (runtime.getCurrentScript().getRemainingUsage() < 100) {
              var taskId = rescheduleCurrentScript(qtyOpbal,qtyOut);
              //log.audit("Rescheduling status: " + task.checkStatus(taskId));
              return;
            }
            record.submitFields({
              "type": "customrecord_tem_opbal_pbbkb_receipt",
              "id": 1,
              "values": {
                "custrecord_tem_qty_out_pbbkb": qtyOut
              }
            });
          }
        }
        log.error('qtyOpbal',qtyOpbal)
        if(qtyOpbal==0){
          for(var idx=lineIn;idx<receiveResult.length;idx++){
            var irDate = receiveResult[idx].getValue({name:'trandate'})
            var poRate = receiveResult[idx].getValue({name:'rate'})
            var receiveAcenum = receiveResult[idx].getValue({name:'custbody_tem_ace_number'})
            var qtyRcv = receiveResult[idx].getValue({name:'quantity'})
            var type =  receiveResult[idx].recordType
            var idTrans =  receiveResult[idx].id
            var idRcvFromAdj = receiveResult[idx].getValue({name:'custbody_tem_inventory_receipt_numbe'})
            var line = receiveResult[idx].getValue({name:'line'})
            var number = receiveResult[idx].id
            if(qtyOutRcv==0){
              qtyOutRcv = receiveResult[idx].getValue({name:'formulanumeric'})
            }
            if(receiveAcenum==""){
              log.error('Error', 'receiveAcenum Not Found')
              var errorRecord = record.create({
                type : "customrecord_tem_log_error_pbbkb",
                isDynamic : true
              });

              errorRecord.setValue('custrecord_tem_log_inv_no',invoiceLinked);
              errorRecord.setValue('custrecord_tem_log_do_num',id);
              errorRecord.setValue('custrecord_tem_log_error',"Ace Number Not Found " + tranId);
              errorRecord.save();
            }
            qtyRcv = qtyRcv - qtyOutRcv
            if(type=='inventoryadjustment'&&idRcvFromAdj!=''){
              var recRcv = record.load({
                type: 'itemreceipt',
                id: idRcvFromAdj,
                isDynamic: false
              });
              var lineNumber = recRcv.findSublistLineWithValue({
                sublistId: 'item',
                fieldId: 'custcol_tem_line_assist',
                value: linkId
              });
              if(lineNumber==-1){
                continue;
              }
              poRate = recRcv.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'rate'
              });
            }else if(type=='inventoryadjustment'&&idRcvFromAdj==''){
              continue;
            }

            if(flagHargaBeliPbbkb){
              var price = parseFloat(poRate)*parseFloat(persentasePbbkb)/100;
            }else{
              if(rateInclude){
                var price = (parseFloat(rate)/((parseFloat(persentasePbbkb)/100)+1))*(parseFloat(persentasePbbkb)/100);
              }else{
                price = (parseFloat(rate)*(parseFloat(persentasePbbkb)/100))
                rateInclude = false
              }
            }
            log.audit('qtySisa Receive start',qtySisa)
            log.audit('qtyPackSisa Receive start',qtyPackSisa)
            log.audit('number',number)
            log.audit('qtyOutRcv',qtyOutRcv)
            log.audit('qtyRcv',qtyRcv)
            log.audit('lineIn',lineIn)
            log.audit('quantity',quantity)
            log.audit('qtyPack',qtyPack)
            log.audit('idTrans',idTrans)
            log.audit('line',line)
            log.audit('id',id)
            if(qtySisa>0){
              if(qtySisa>qtyRcv){
                var pbbkbRecord = record.create({
                  type : "customrecord_tem_form_pbbkb",
                  isDynamic : true
                });
                pbbkbRecord.setValue('custrecord_tem_pbbkb_acenum',receiveAcenum);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_no_inv',invoiceLinked);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_customer',entity);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_sales_cc',department);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_do_num',id);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_item',item);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_qty',qtyRcv);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_ship_from',locationnohierarchy);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_ship_to',shipaddress);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_kabupaten',city);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_invoice_rate',rate);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_po_num',noPoAngkutan);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_price',price);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_ir_date',format.parse({value:irDate, type: format.Type.DATE}));
                pbbkbRecord.setValue('custrecord_tem_pbbkb_po_rate',poRate);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_amount',Math.round(price*qtyRcv));
                pbbkbRecord.setValue('custrecord_tem_rate_include_pbbkb_form',rateInclude);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_rate_percentage',parseFloat(persentasePbbkb));
                pbbkbRecord.setValue('custrecord_tem_pbbkb_flag_beli',flagHargaBeliPbbkb);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_qty_pack',qtyRcv);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_ir_num',number);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_vendor_oat',vendorOat);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_item_oat',itemPo);
                pbbkbRecord.setValue('custrecord_tem_delivery_type',deliveryType);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_line_id',linkId);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_lineid_ir',line);
                if(packDate){
                  pbbkbRecord.setValue('custrecord_tem_pbbkb_dopack_date',format.parse({value:packDate, type: format.Type.DATE}));
                }
                pbbkbRecord.save();
                if(pbbkbRecord.id>0){
                  qtyPackSisa = qtyPackSisa - qtyRcv
                  qtySisa = qtySisa - qtyRcv

                  var recRcv = record.load({
                    type: 'itemreceipt',
                    id: idTrans,
                    isDynamic: false
                  });
                  var lineNumber = recRcv.findSublistLineWithValue({
                    sublistId: 'item',
                    fieldId: 'line',
                    value: line
                  });
                  recRcv.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_tem_flag_pbbkb_trx',
                    value: qtyRcv,
                    line: lineNumber
                  });
                  recRcv.save()
                  lineIn++

                  if (runtime.getCurrentScript().getRemainingUsage() < 100) {
                    var taskId = rescheduleCurrentScript(qtyOpbal,qtyOut);
                    //log.audit("Rescheduling status: " + task.checkStatus(taskId));
                    return;
                  }
                  continue;
                }
              }

              if(qtySisa<qtyRcv){
                var pbbkbRecord = record.create({
                  type : "customrecord_tem_form_pbbkb",
                  isDynamic : true
                });
                pbbkbRecord.setValue('custrecord_tem_pbbkb_acenum',receiveAcenum);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_no_inv',invoiceLinked);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_customer',entity);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_sales_cc',department);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_do_num',id);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_item',item);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_qty',qtySisa);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_ship_from',locationnohierarchy);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_ship_to',shipaddress);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_kabupaten',city);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_invoice_rate',rate);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_po_num',noPoAngkutan);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_price',price);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_ir_date',format.parse({value:irDate, type: format.Type.DATE}));
                pbbkbRecord.setValue('custrecord_tem_pbbkb_po_rate',poRate);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_amount',Math.round(price*qtySisa));
                pbbkbRecord.setValue('custrecord_tem_rate_include_pbbkb_form',rateInclude);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_ir_num',number);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_rate_percentage',parseFloat(persentasePbbkb));
                pbbkbRecord.setValue('custrecord_tem_pbbkb_flag_beli',flagHargaBeliPbbkb);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_qty_pack',qtyPackSisa);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_vendor_oat',vendorOat);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_item_oat',itemPo);
                pbbkbRecord.setValue('custrecord_tem_delivery_type',deliveryType);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_line_id',linkId);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_lineid_ir',line);
                if(packDate){
                  pbbkbRecord.setValue('custrecord_tem_pbbkb_dopack_date',format.parse({value:packDate, type: format.Type.DATE}));
                }
                pbbkbRecord.save();
                if(pbbkbRecord.id>0){
                  qtyRcv = qtyRcv - qtyPackSisa
                  qtySisa = 0
                  qtyOutRcv = parseFloat(qtyOutRcv) + parseFloat(qtyPackSisa)
                  var recDo = record.load({
                    type: 'itemfulfillment',
                    id: id,
                    isDynamic: false
                  });
                  var lineNumber = recDo.findSublistLineWithValue({
                    sublistId: 'item',
                    fieldId: 'custcol_tem_line_assist',
                    value: linkId
                  });
                  recDo.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_tem_flag_pbbkb_trx',
                    value: quantity,
                    line: lineNumber
                  });
                  recDo.save()

                  var recRcv = record.load({
                    type: 'itemreceipt',
                    id: idTrans,
                    isDynamic: false
                  });
                  var lineNumber = recRcv.findSublistLineWithValue({
                    sublistId: 'item',
                    fieldId: 'line',
                    value: line
                  });
                  recRcv.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_tem_flag_pbbkb_trx',
                    value: qtyOutRcv,
                    line: lineNumber
                  });

                  recRcv.save()

                  if (runtime.getCurrentScript().getRemainingUsage() < 100) {
                    var taskId = rescheduleCurrentScript(qtyOpbal,qtyOut);
                    //log.audit("Rescheduling status: " + task.checkStatus(taskId));
                    return;
                  }
                  break;
                }
              }
            }else{
              if(parseFloat(qtyRcv)>parseFloat(quantity)){
                var pbbkbRecord = record.create({
                  type : "customrecord_tem_form_pbbkb",
                  isDynamic : true
                });
                //set the values in the required fields in JE main section
                pbbkbRecord.setValue('custrecord_tem_pbbkb_acenum',receiveAcenum);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_no_inv',invoiceLinked);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_customer',entity);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_sales_cc',department);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_do_num',id);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_item',item);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_qty',quantity);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_ship_from',locationnohierarchy);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_ship_to',shipaddress);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_kabupaten',city);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_invoice_rate',rate);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_po_num',noPoAngkutan);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_price',price);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_ir_date',format.parse({value:trandate, type: format.Type.DATE}));
                pbbkbRecord.setValue('custrecord_tem_pbbkb_po_rate',poRate);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_amount',Math.round(price*quantity));
                pbbkbRecord.setValue('custrecord_tem_rate_include_pbbkb_form',rateInclude);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_ir_num',number);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_rate_percentage',parseFloat(persentasePbbkb));
                pbbkbRecord.setValue('custrecord_tem_pbbkb_flag_beli',flagHargaBeliPbbkb);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_qty_pack',qtyPack);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_vendor_oat',vendorOat);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_item_oat',itemPo);
                pbbkbRecord.setValue('custrecord_tem_delivery_type',deliveryType);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_line_id',linkId);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_lineid_ir',line);
                if(packDate){
                  pbbkbRecord.setValue('custrecord_tem_pbbkb_dopack_date',format.parse({value:packDate, type: format.Type.DATE}));
                }
                pbbkbRecord.save();
                if(pbbkbRecord.id>0){
                  qtyRcv = parseFloat(qtyRcv) - parseFloat(qtyPack)
                  qtyOutRcv = parseFloat(qtyOutRcv) + parseFloat(qtyPack)
                  var recDo = record.load({
                    type: 'itemfulfillment',
                    id: id,
                    isDynamic: false
                  });
                  var lineNumber = recDo.findSublistLineWithValue({
                    sublistId: 'item',
                    fieldId: 'custcol_tem_line_assist',
                    value: linkId
                  });
                  recDo.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_tem_flag_pbbkb_trx',
                    value: quantity,
                    line: lineNumber
                  });
                  recDo.save()
                  var recRcv = record.load({
                    type: 'itemreceipt',
                    id: idTrans,
                    isDynamic: false
                  });
                  var lineNumber = recRcv.findSublistLineWithValue({
                    sublistId: 'item',
                    fieldId: 'line',
                    value: line
                  });
                  recRcv.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_tem_flag_pbbkb_trx',
                    value: qtyOutRcv,
                    line: lineNumber
                  });
                  recRcv.save()
                  if (runtime.getCurrentScript().getRemainingUsage() < 100) {
                    var taskId = rescheduleCurrentScript(qtyOpbal,qtyOut);
                    //log.audit("Rescheduling status: " + task.checkStatus(taskId));
                    return;
                  }
                  break;
                }
              }else if(parseFloat(qtyRcv)<parseFloat(quantity)){
                var pbbkbRecord = record.create({
                  type : "customrecord_tem_form_pbbkb",
                  isDynamic : true
                });
                pbbkbRecord.setValue('custrecord_tem_pbbkb_acenum',receiveAcenum);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_no_inv',invoiceLinked);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_customer',entity);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_sales_cc',department);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_do_num',id);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_item',item);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_qty',qtyRcv);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_ship_from',locationnohierarchy);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_ship_to',shipaddress);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_kabupaten',city);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_invoice_rate',rate);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_po_num',noPoAngkutan);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_price',price);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_ir_date',format.parse({value:trandate, type: format.Type.DATE}));
                pbbkbRecord.setValue('custrecord_tem_pbbkb_po_rate',poRate);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_amount',Math.round(price*qtyRcv));
                pbbkbRecord.setValue('custrecord_tem_rate_include_pbbkb_form',rateInclude);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_rate_percentage',parseFloat(persentasePbbkb));
                pbbkbRecord.setValue('custrecord_tem_pbbkb_flag_beli',flagHargaBeliPbbkb);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_qty_pack',qtyRcv);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_ir_num',number);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_vendor_oat',vendorOat);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_item_oat',itemPo);
                pbbkbRecord.setValue('custrecord_tem_delivery_type',deliveryType);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_line_id',linkId);
                pbbkbRecord.setValue('custrecord_tem_pbbkb_lineid_ir',line);
                if(packDate){
                  pbbkbRecord.setValue('custrecord_tem_pbbkb_dopack_date',format.parse({value:packDate, type: format.Type.DATE}));
                }
                pbbkbRecord.save();
                if(pbbkbRecord.id>0){
                  qtyPackSisa = qtyPack - qtyRcv
                  qtySisa = quantity - qtyRcv
                  qtyOut = parseFloat(qtyOut) + parseFloat(qtyOpbal)
                  qtyOpbal = 0
                  qtyOutRcv = receiveResult[idx].getValue({name:'quantity'})
                  lineIn++;
                  log.debug('Receive STD', 'END')
                  var recRcv = record.load({
                    type: 'itemreceipt',
                    id: idTrans,
                    isDynamic: false
                  });
                  var lineNumber = recRcv.findSublistLineWithValue({
                    sublistId: 'item',
                    fieldId: 'line',
                    value: line
                  });
                  recRcv.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_tem_flag_pbbkb_trx',
                    value: qtyOutRcv,
                    line: lineNumber
                  });
                  recRcv.save()
                  qtyOutRcv=0
                  if (runtime.getCurrentScript().getRemainingUsage() < 100) {
                    var taskId = rescheduleCurrentScript(qtyOpbal,qtyOut);
                    //log.audit("Rescheduling status: " + task.checkStatus(taskId));
                    return;
                  }
                  continue;
                }
              }
            }

          }
        }

      }



      log.audit({
        "title": "Remaining Usage: START",
        "details": runtime.getCurrentScript().getRemainingUsage()
      });

      //var scheduledScriptTask = task.create({
      //  taskType: task.TaskType.SCHEDULED_SCRIPT,
      //  scriptId: 'customscript_tem_pbbkb_to_je_ss',
      //  deploymentId: 'customdeploy_tem_pbbkb_to_je_ss'
      //});
      //var resx = scheduledScriptTask.submit();



    }catch(e){
      log.error("ERROR",e)
    }
  }

  function cleansingErrorRecord(){

    var results = search.create({
      type: 'customrecord_tem_log_error_pbbkb',
      filters: [
      ],
      columns:["internalid"]
    }).run().getRange(0, 10);

    for(var idx in results){
      var objRecord = record.delete({ type: 'customrecord_tem_log_error_pbbkb', id: results[idx]['id']});
    }
  }

  function rescheduleCurrentScript(qtyOpbal,qtyOut) {
    record.submitFields({
      "type": "customrecord_tem_opbal_pbbkb_receipt",
      "id": 1,
      "values": {
        "custrecord_tem_qty_out_pbbkb": qtyOut
      }
    });
    var scheduledScriptTask = task.create({
      taskType: task.TaskType.SCHEDULED_SCRIPT
    });
    scheduledScriptTask.scriptId = runtime.getCurrentScript().id;
    scheduledScriptTask.deploymentId = runtime.getCurrentScript().deploymentId;
    return scheduledScriptTask.submit();
  }
  
  function rescheduleCurrentScriptTTC() {
    var scheduledScriptTask = task.create({
      taskType: task.TaskType.SCHEDULED_SCRIPT
    });
    scheduledScriptTask.scriptId = runtime.getCurrentScript().id;
    scheduledScriptTask.deploymentId = runtime.getCurrentScript().deploymentId;
    return scheduledScriptTask.submit();
  }

  function executeScript(context) {
    var scriptObj = runtime.getCurrentScript();
    var period = scriptObj.getParameter({name: 'custscript_as_of_date'});
    cleansingErrorRecord()
    if(runtime.getCurrentScript().getRemainingUsage() > 100){
      ttcProccess(period)
    }
    if(runtime.getCurrentScript().getRemainingUsage() > 100){
      nonttc(period)
    }

    return
  }
  return {
    execute: executeScript
  };
});