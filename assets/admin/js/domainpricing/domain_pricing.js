function showConfig(module) {
    $("#"+module+"config").fadeToggle();
}
jQuery('.autofillcheck').change(function() {
    var checkId =$(this).data('valid');
    if ($(this).prop('checked')) { 
        $("#"+checkId).val(1);
    }
    else {
        $("#"+checkId).val(0);
    }
});

jQuery("#price_record").delegate(".tld-group li a", "click", function(e){ 
    e.preventDefault();
    var tldId = jQuery(this).parent().parent().data('tld-id'),
        group = jQuery(this).find('span').attr('data-group'),
        spanHtml = jQuery(this).html();
    if (group != 'none') {
        jQuery('#dp-' + tldId).first('td').find('div.selected-tld-group').html(spanHtml);
    } else {
        jQuery('#dp-' + tldId).first('td').find('div.selected-tld-group').html('');
    }
    jQuery('input[name="group[' + tldId + ']"]').val(group);
});

jQuery("#price_record").delegate("#checkAllTld", "click", function(event){ 
    jQuery(event.target).parents(".datatable").find("input[name='tldId[]']").prop("checked", this.checked);
});

jQuery("#price_record").delegate("#duplicateModalAjax", "click", function(ev){ 
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

$("#price_record,#ajaxmodel").delegate(".ajaxDirectSubmit", "click", function(){ 
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

$("#price_record").delegate(".priceDelete", "click", function(e){
    e.preventDefault();
    var route = $(this).data('route');
    Lobibox.confirm({
      title: 'Delete Confirmation',
      msg: 'Are you sure you want to delete?',
      callback: function ($this, type, ev) {
        if (type === 'yes'){
            priceDelete(route);
          }else{
            return false;
          }
        }
    });
 });

function priceDelete(route, id) {
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

jQuery("#price_record").delegate(".open-pricing", "click", function(ev){ 
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
           $("#ajaxmodel").html(data['html']);
           // $("#ajaxPricingmodel").html(data['html']);
           // $("#domainPricingSettingForm").hide();
        },
        error: function (e) {
        }
    });
});

jQuery("#price_record").delegate(".domainTagMdl", "click", function(ev){ 
    ev.preventDefault();
    var route = jQuery(this).data("href");
    $("#modalAjaxTitle").html(jQuery(this).data("modal-title"));
    $.ajax({
        type: "get",
        url: route,
        cache: false,
        timeout: 600000,
        dataType: 'json',
        success: function (data) {
           $("#domainTagModel").find("#ajaxmodel").html(data.html);
           $('#domainTagModel').modal('toggle');
        },
        error: function (e) {
        }
    });
});



     

            
