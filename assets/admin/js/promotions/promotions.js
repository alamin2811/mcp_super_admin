  function showConfig(module) {
    $("#"+module+"config").fadeToggle();
}

jQuery("#currencies_record").delegate("#duplicateModalAjax", "click", function(ev){ 
  ev.preventDefault();
  var route = jQuery(this).data("href");
  $("#modalAjaxTitle").html(jQuery(this).data("modal-title"));
  $('#domainPricingModel').modal('toggle');
    $.ajax({
        type: "get",
        url: route,
        cache: false,
        timeout: 600000,
        success: function (data) {
            $("#ajaxmodel").html(data);
            $(".loader").hide();
        },
        error: function (e) {
        }
    });
});

$("#currencies_record,#ajaxmodel,#add_currency").delegate(".ajaxDirectSubmit", "click", function(){ 
  var submitFormId = 'F_' + this.id;
  var action = $("#" + submitFormId).attr("action");
  $("#"+submitFormId).validate({
      errorPlacement: function(e, r) {
        if(r.attr("type") == 'text'){
         "radio" == r.attr("type") || "checkbox" == r.attr("type") ? e.insertAfter($(r).closest(".form-group").children("div").children().last()) : "card_expiry_mm" == r.attr("name") || "card_expiry_yyyy" == r.attr("name") ? e.appendTo($(r).closest(".form-group").children("div")) : e.insertAfter(r)
         }else{
           e.appendTo(r.closest('.ermsg')); 
         }
      },
      submitHandler: function(form) {
          $(".ajaxDirectSubmit").prop("disabled", true);
          $(form).ajaxSubmit({
              url: action,
              type: "post",
              success: function(data) { 
                  $('.ajaxDirectSubmit').prop("disabled", false);
                  Lobibox.notify(data['type'], {
                        position: "top right",
                        msg: data['message']
                    });
                  if (data['status_code'] == 200) {
                      if (data['model'] == 'false') {
                        $('#domainPricingModel').modal('hide');
                      }
                      if (data['reset']) {
                          document.getElementById(submitFormId).reset();
                      }
                      if(data['url']){
                        location.href = data['url'];
                      }
                      if(data['html']){
                          $('#'+data['appendId']).html(data['html']);
                      }
                  }
              },
              error: function(e) {
                  $('.ajaxDirectSubmit').prop("disabled", false);
                  var Arry = e.responseText;
                  var error = "";
                  JSON.parse(Arry, (k, v) => {
                      if (typeof v != 'object') {
                          error += v + "<br>"
                      }
                  })
                 Lobibox.notify('error', {
                      rounded: false,
                      delay: 5000,
                      delayIndicator: true,
                      position: "top right",
                      msg: error
                  });
              }
          });
      },
  });
});

$("#currencies_record").delegate(".currenciesDelete", "click", function(e){
    e.preventDefault();
    var route = $(this).data('route');
    Lobibox.confirm({
      title: 'Delete Confirmation',
      msg: 'Are you sure you, want to delete?',
      callback: function ($this, type, ev) {
        if (type === 'yes'){
            recordDelete(route);
          }else{
            return false;
          }
        }
    });
 });

function recordDelete(route, id) {
    $('#loader').show();
    $.ajax({
        type: "get",
        url: route,
        data : {
            _token : getMetaContentByName('csrf-token')
        },
        datatype: "html",
        beforeSend: function() {
            
        },
        success : function(data) {
                  Lobibox.notify(data['type'], {
                      position: "top right",
                      msg: data['message']
                  });
                  if (data['status_code'] == 200) {
                        if(data['html']){
                          $('#'+data['appendId']).html(data['html']);
                        }
                }
        }, 
        error : function(jqXHR, ajaxOptions, thrownError) {
            $('#loader').hide();
        }
    })
}