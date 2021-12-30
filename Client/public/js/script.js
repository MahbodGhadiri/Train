$(document).ready(function() {

    $('.skillsbox .fa-arrow-down').click(function() {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $('.skillsbox ul').slideDown();
            $(this).css('transform', 'rotate(180deg)');
        } else {
            $('.skillsbox ul').slideUp();
            $(this).css('transform', 'rotate(0deg)');
        }
    });

    $('.show-box .show-item i.fa-eye').click(function() {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {

            $(this).removeClass('fa-eye').addClass('fa-eye-slash');
            $('#pro-pass').attr('type', 'text');
        } else {
            $(this).removeClass('fa-eye-slash').addClass('fa-eye');
            $('#pro-pass').attr('type', 'password');
        }
    });



    // Height Window
    var hw = ($(window).height()) - 125;
    $('.alonebox,.groupbox').css('height', hw + 'px');

    // Post
    $('.post-btn').click(function(e) {
        $('.post').show(200);
    });
    $('.post .fa-times').click(function(e) {
        $('.post').hide(200);
    });

    // Alert Close
    $('.alert-b i.fa-times').click(function(e) {
        $('.alert-b').hide(100);
    });

    // AloneRow
    $('.alonerow i.fa-arrow-down').on('click', function() {
        $(this).closest('.task').find('.task-down').toggle(350);
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $(this).closest('.alonerow').find('.time').hide(200);
        } else {
            $(this).closest('.alonerow').find('.time').show(200);
        }
    });

    // Height Window
    var hw = ($(window).height()) - 130;
    $('.alonebox,.groupbox').css('height', hw + 'px');

    // Post
    $('.post-btn').click(function(e) {
        $('.post').show(200);
    });
    $('.post .fa-times').click(function(e) {
        $('.post').hide(200);
    });

    // Alert Close
    $('.alert-b i.fa-times').click(function(e) {
        $('.alert-b').hide(100);
    });

});