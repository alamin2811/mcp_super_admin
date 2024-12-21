//open new notes popup
$('.create_new_notes').on('click', function (event) {
    event.preventDefault();
    $('#create_notes').modal('show');
});
//change view
$(".switch-mode-grid").on('change', function () {
    var val = $("#btn_list").attr("style", "background-color: rgb(100, 189, 99); border-color: rgb(100, 189, 99); box-shadow: rgb(100, 189, 99) 0px 0px 0px 8px inset; transition: border 0.4s, box-shadow 0.4s, background-color 1.2s;");
    $("#btn_list small").attr("style", "left: 14px; transition: background-color 0.4s, left 0.2s; background-color: rgb(255, 255, 255);");
    var url = adminUrl + '/getview/';
    $.get(url + 2, function (data) {
        if (data != '') {
            window.location.href = adminUrl + '/notemanager/grid';
        }
    });

});
$(".switch-mode-list").on('change', function () {

    var val = $("#btn_grid").attr("style", "background-color: rgb(255, 255, 255); border-color: rgb(223, 223, 223); box-shadow: rgb(223, 223, 223) 0px 0px 0px 0px inset; transition: border 0.4s, box-shadow 0.4s;");
    $("#btn_grid small").attr("style", "left: 0px; transition: background-color 0.4s, left 0.2s;");
    var url = adminUrl + '/getview/';
    $.get(url + 1, function (data) {
        if (data != '') {
            window.location.href = adminUrl + '/notemanager';
        }
    });

});

$(document).ready(function () {
    // CSRF protection
    $.ajaxSetup(
    {
        headers:
        {
            'X-CSRF-Token': $('input[name="_token"]').val()
        }
    });
});
//validate create modal
$("#btn_create_notes").click(function (event) {
    event.preventDefault();
    var ntitle = $("#create-title").val();
    var ndesc = $("#create-description").val();
    if (ntitle == "") {
        $("#createGetError").removeClass('hidden');
    }
    if (ntitle != "") {
        $("#createGetError").addClass('hidden');
    }
    if (ndesc == "") {
        $("#createGetError").removeClass('hidden');
    }
    if (ndesc == "") {
        $("#createGetError").removeClass('hidden');
    }
    if (ntitle != "" && ndesc != "") {
        $("#formCreateNotes").submit();
        $("#create_notes").find(".close").trigger("click");
        $(".hideshow").show();
    }
});

//validate edit modal
$("#btn_update_notes").click(function (event) {
    event.preventDefault();

    var ntitle = $("#edit-title").val();
    var ndesc = $('#edit-description').val();
    if (ntitle == "") {
        $("#editGetError").removeClass('hidden');
    }
    if (ntitle != "") {
        $("#editGetError").addClass('hidden');
    }
    if (ndesc == "") {
        $("#editGetError").removeClass('hidden');
    }
    if (ndesc == "") {
        $("#editGetError").removeClass('hidden');
    }
    if (ntitle != "" && ndesc != "") {
        $("#formEditNotes").submit();
    }
});

$('.btn_edit_notes').on('click', function (event) {
    event.preventDefault();
    var current_id = $(this).data('id');
    var url = adminUrl + '/edit-note/';

    // ajax call
    $.get(url + current_id, function (data) {
        console.log(data);
        if (data != '') {
            $("#edit_category_id").val(data.category_id);
            $("#edit-title").val(data.title);
            $("#edit-description").val(data.description);
            $("#edit_status").val(data.status);
            $("#select_priority").val(data.priority);
            $('#notes_id').val(data.id)
            $("input[name='_token']").val();
            $('#edit_notes').modal('show');
        }
    });
});

//delete task
$(".btn-delete").on('click', function (event) {
    event.preventDefault();
    var current_id = $(this).closest('td').attr('id');
    swal({
        title: "Are you sure?",
        text: "You will not be able to recover this note!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: true,
        closeOnCancel: true
    },
    function (isConfirm)
    {
        if (isConfirm)
        {
            var url = adminUrl + '/delete-note/';
            window.location.href = url + current_id;
        } else
        {
            swal('not deleted');
        }
    });
});
//satus update
$(".status").on('change', function () {
    var current_id = $(this).closest('td').attr('id');
    var ddl = $("tr#" + current_id).find('select').attr('id');
    var ddl_id = "#" + ddl;
    var val = $(ddl_id + ' :selected').val();
    if (val == "On hold")
    {
        val = "on_hold";
    }
    
    var url = adminUrl + '/notes/status/';
    $.get(url + val + "/" + current_id, function (data) {
        if (data != "") {
            window.location.href = adminUrl + '/notes/status-update-confirm/' + current_id;
        }
    });
});

//get assigned Members
$(".btn_reassign").on('click', function (event) {
    event.preventDefault();
    var current_id = $(this).attr('id');
    
    var url = adminUrl + '/notes/getmembers/';
    $.get(url + current_id, function (data) {
        if (data != "") {
            $length = data.length;
            var str = "";
            jQuery.each(data, function (i, val) {
                str += "<tr>";
                if (val.image != "") {
                    str += "<td><img src='" + siteurl + "storage/profile/" + val.image + "' class='img-circle img-xs'>&nbsp;" + "  " + val.first_name + " " + val.last_name + "</td><td><a class='text-danger' href='" + adminUrl + "/notes/members/reassign/" + val.id + "/" + current_id + "'>Unassign</a></td>";
                }
                if (val.image == "") {
                    str += "<td><img src='" + siteurl + "assets/admin/images/placeholder.jpg' class='img-circle img-xs'>&nbsp;" + "  " + val.first_name + " " + val.last_name + "</td><td><a class='text-danger' href='" + adminUrl + "/notes/members/reassign/" + val.id + "/" + current_id + "'>Unassign</a></td>";
                }
                str += "</tr>";
            });
            $('.members').html(str);
            $('#members_notes').modal('show');
        }
    },'json');

});
//upload attachments
$(".btn_attachments").on('click', function (event) {
    event.preventDefault();
    var current_id = $(this).attr('rel');
    console.log(current_id);
    $("#attachments_form").append("<input type='hidden' value='" + current_id + "' name='notes_id'>");
    $('#notes_attachments').modal('show');

});
//show notes
$(".title").on('click', function (event) {
    event.preventDefault();
    var current_id = $(this).closest('td').attr('id');

    var url = adminUrl + '/notes/';
    $.get(url + current_id, function (data) {
        console.log(data);
        if (data != "") {
            $length = data.length;
            var str = "";
            jQuery.each(data, function (i, val) {
                var id = val.id;
                alert(id)
                str += "<tr>";
                if (val.image != "") {
                    str += "<td><img src='" + siteurl + "storage/profile/" + val.image + "' class='img-circle img-xs'>" + "  " + val.first_name + " " + val.last_name + "</td><td><a class='text-danger' href='" + adminUrl + "/notes/members/reassign/" + val.id + "/" + current_id + "'>Unassign</a></td>";
                }
                if (val.image == "") {
                    str += "<td><img src='" + siteurl + "assets/admin/images/placeholder2.jpg' class='img-circle img-xs'>" + "  " + val.first_name + " " + val.last_name + "</td><td><a class='text-danger' href='" + adminUrl + "/notes/members/reassign/" + val.id + "/" + current_id + "'>Unassign</a></td>";
                }
                str += "</tr>";
            });
            $('.members').html(str);
            $('#members_notes').modal('show');
        }
    });

});

//open new notes popup
$('.create_new_notes').on('click', function (event) {
    event.preventDefault();
    $('#create_notes').modal('show');
});

//delete task
$(".btn-shared_delete").on('click', function (event) {
    event.preventDefault();
    var current_id = $(this).closest('td').attr('id');
    var current_note = $('table tbody tr#' + current_id).find('td').eq(1).text();
    swal({
        title: "Are you sure?",
        text: "You will not be able to recover this note!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: true,
        closeOnCancel: true
    },
    function (isConfirm)
    {
        if (isConfirm)
        {   
            var url = adminUrl + '/shared/delete-note/';
            $.get(url + current_id, function (data) {
                if (data != "") {

                    window.location.href = adminUrl + '/shared/delete-note-confirm';
                }
            });

        } else
        {
            swal('not deleted');
        }
    });
});

//get Members
$(".btn_shared_reassign").on('click', function (event) {
    event.preventDefault();
    var current_id = $(this).closest('td').attr('id');
    var url = adminUrl + '/shared/notes/getmembers/';
    $.get(url + current_id, function (data) {
        console.log(data);
        if (data != "") {
            $length = data.length;
            var str = "";
            jQuery.each(data, function (i, val) {
                str += "<tr>";
                if (val.image != "") {
                    str += "<td><img src='" + siteurl + "storage/profile/" + val.image + "' class='img-circle img-xs'>" + "  " + val.first_name + " " + val.last_name + "</td><td><a class='text-danger' href='" + adminUrl + "/shared/notes/members/reassign/" + val.id + "/" + current_id + "'>Unassign</a></td>";
                }
                if (val.image == "") {
                    str += "<td><img src='" + siteurl + "assets/admin/images/placeholder2.jpg' class='img-circle img-xs'>" + "  " + val.first_name + " " + val.last_name + "</td><td><a class='text-danger' href='" + adminUrl + "/shared/notes/members/reassign/" + val.id + "/" + current_id + "'>Unassign</a></td>";
                }
                str += "</tr>";
            });
            $('.members').html(str);
            $('#members_notes').modal('show');
        }
    });

});
//upload attachments
$(".btn_shared_attachments").on('click', function (event) {
    event.preventDefault();
    var current_id = $(this).closest('td').attr('id');
    $("#attachments_form").append("<input type='hidden' value='" + current_id + "' name='notes_id'>");
    $('#notes_attachments').modal('show');

});
//show notes
$(".title").on('click', function (event) {
    event.preventDefault();
    var current_id = $(this).closest('td').attr('id');
    var url = adminUrl + '/shared/notes/';
    $.get(url + current_id, function (data) {
        console.log(data);
        if (data != "") {
            $length = data.length;
            var str = "";
            jQuery.each(data, function (i, val) {
                var id = val.id;
                alert(id)
                str += "<tr>";
                if (val.image != "") {
                    str += "<td><img src='" + siteurl + "storage/profile/" + val.image + "' class='img-circle img-xs'>" + "  " + val.first_name + " " + val.last_name + "</td><td><a class='text-danger' href='" + adminUrl + "/dashboard/notes/members/reassign/" + val.id + "/" + current_id + "'>Unassign</a></td>";
                }
                if (val.image == "") {
                    str += "<td><img src='" + siteurl + "assets/admin/images/placeholder2.jpg' class='img-circle img-xs'>" + "  " + val.first_name + " " + val.last_name + "</td><td><a class='text-danger' href='" + adminUrl + "/dashboard/notes/members/reassign/" + val.id + "/" + current_id + "'>Unassign</a></td>";
                }
                str += "</tr>";
            });
            $('.members').html(str);
            $('#members_notes').modal('show');
        }
    });

});