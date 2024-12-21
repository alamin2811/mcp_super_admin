/* ------------------------------------------------------------------------------
*
*  # Customers
*
*  Demo JS code for ecommerce_customers.html page
*
* ---------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function() {


    


    // Table setup
    // ------------------------------

    // Initialize
    $('.table-customers').DataTable({
        autoWidth: false,
        columnDefs: [
            {
                targets: 0,
                width: 400
            },
            { 
                orderable: false,
                width: 16,
                targets: 6
            },
            {
                className: 'control',
                orderable: false,
                targets: -1
            },
        ],
        order: [[ 0, 'asc' ]],
        dom: '<"datatable-header datatable-header-accent"fBl><""t><"datatable-footer"ip>',
        language: {
            search: '<span>Search people:</span> _INPUT_',
            searchPlaceholder: 'Type to filter...',
            lengthMenu: '<span>Show:</span> _MENU_',
            paginate: { 'first': 'First', 'last': 'Last', 'next': $('html').attr('dir') == 'rtl' ? '&larr;' : '&rarr;', 'previous': $('html').attr('dir') == 'rtl' ? '&rarr;' : '&larr;' }
        },
        lengthMenu: [ 25, 50, 75, 100 ],
        displayLength: 50,
        responsive: {
            details: {
                type: 'column',
                target: -1
            }
        },
        buttons: [
            {
                extend: 'pdfHtml5',
                text: 'Export list <i class="icon-file-pdf position-right"></i>',
                className: 'btn bg-blue',
                orientation: 'landscape',
                exportOptions: {
                    columns: [ 0, 1, 2, 3, 4, 5 ],
                    stripHtml: true
                },
                customize: function (doc) {
                    doc.content[1].table.widths = Array(doc.content[1].table.body[0].length + 1).join('*').split('');
                }
            }
        ],
        drawCallback: function (settings) {
            $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').addClass('dropup');
        },
        preDrawCallback: function(settings) {
            $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').removeClass('dropup');
        }
    });


    // External table additions
    // ------------------------------
    
    // Enable Select2 select for the length option
    $('.dataTables_length select').select2({
        minimumResultsForSearch: Infinity,
        width: 'auto'
    });

});
