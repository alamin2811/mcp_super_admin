
$(function() {
    $("#currencies_record").delegate(".editCurrency", "click", function(ev){ 
        ev.preventDefault();
        var route = jQuery(this).data("href");
        $("#modalAjaxTitle").html(jQuery(this).data("modal-title"));
        $('#currencyModel').modal('toggle');
          $.ajax({
              type: "get",
              url: route,
              cache: false,
              timeout: 600000,
              success: function (data) {
                  $('#currencyModel').find("#ajaxmodel").html(data);
                  $(".loader").hide();
              },
              error: function (e) {
              }
          });
    });

    $("#currencies_record,#currencyModel,#add_currency").delegate(".ajaxDirectSubmit", "click", function(){ 
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
                            $('#currencyModel').modal('hide');
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
     
    $("#currencyModel").delegate(".ajaxDirectSubmit", "click", function(){ 
    var submitFormId = 'F_' + this.id;
    var action = $("#" + submitFormId).attr("action");

    var valid_cnt = validateFields($("#"+submitFormId));

    if (valid_cnt) {
        return false;
    }

    $(".ajaxDirectSubmit").prop("disabled", true);
        $("#"+submitFormId).ajaxSubmit({
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
                      $('#currencyModel').modal('hide');
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
    });
});

function showConfig(module) {
    $("#"+module+"config").fadeToggle();
}

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

function validateFields(form) {
    var valid_cnt = 0;
    form.find(".valid").each(function () {
        var value = $(this).val();
        var name = $(this).attr("name");
        var title = 'Required';

        if ($(this).parent().find("label#" + name + "-error").length) {
            $(this).parent().find("label#" + name + "-error").remove();
        }

        if (!value) {
            if (name != 'phonenumber') {
                var html = '<label id="' + name + '-error" class="fld_error" for="' + name + '">' + title + '</label>';
                $(this).parent().find("input").after(html);
                valid_cnt++;
            }

            if (name == 'message' || name == 'content') {
                var html = '<label id="' + name + '-error" class="fld_error" for="' + name + '">' + title + '</label>';
                $(this).parent().find("textarea").after(html);
                valid_cnt++;
            }
        } else {
            $(this).parent().find("label#" + name + "-error").remove();
        }

        if (name == 'phonenumber') {
            if ($(this).parent().find("label#" + name + "-error").length) {
                $(this).parent().find("label#" + name + "-error").remove();
            }
            var phoneFilter = /^\d*(?:\.\d{1,2})?$/;

            if (!phoneFilter.test(value) || value.length != 10) {
                var html = '<label id="' + name + '-error" class="fld_error" for="' + name + '">' + transJs.valid_phone + '</label>';
                $(this).parent().find("input").after(html);
                valid_cnt++;
            } else {
                $(this).parent().find("label#" + name + "-error").remove();
            }
        }

        
    });

    return valid_cnt;
}