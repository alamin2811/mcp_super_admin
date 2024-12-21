/* ------------------------------------------------------------------------------
*
*  # CKEditor editor
*
*  Specific JS code additions for editor_ckeditor.html page
*
*  Version: 1.0
*  Latest update: Aug 1, 2015
*
* ---------------------------------------------------------------------------- */

$(function() {

    // Full featured editor
    var ckeditor = CKEDITOR.replace( 'editor_full', {
        height: '400px',
        extraPlugins: 'forms'
    });
    
    $("ul li a.special_character").on('click', function (event) {
        event.preventDefault();
        var val = this.id;
        var selection = ckeditor.getSelection();
        var ranges = selection.getRanges();
        selection.selectRanges(ranges);
        ckeditor.insertHtml(val);
    });
});
